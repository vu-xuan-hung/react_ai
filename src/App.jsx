/* eslint-disable no-unused-vars */
/* eslint-disable no-empty */
/* eslint-disable no-debugger */
import { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { Chat } from "./components/Chat/Chat";
import { Assistant } from "./components/Assistant/Assistant";
import { Theme } from "./components/Theme/Theme";
import styles from "./App.module.css";

function App() {
  const [assistant, setAssistant] = useState();
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState();
  const activeChatMessages = useMemo(
    () => chats.find(({ id }) => id === activeChatId)?.messages ?? [],
    [chats, activeChatId]
  );
  useEffect(() => {
    handleNewChatCreate();
  }, []);

  function handleAssistantChange(newAssistant) {
    setAssistant(newAssistant);
  }

  function handleChatMessagesUpdate(id, messages) {
    const title = messages[0]?.content.split(" ").slice(0, 7).join(" ");

    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === id
          ? { ...chat, title: chat.title ?? title, messages }
          : chat
      )
    );
  }

  function handleNewChatCreate() {
    const id = uuidv4();

    setActiveChatId(id);
    setChats((prevChats) => [...prevChats, { id, messages: [] }]);
  }

  function handleActiveChatIdChange(id) {
    setActiveChatId(id);
    setChats((prevChats) =>
      prevChats.filter(({ messages }) => messages.length > 0)
    );
  }
  useEffect(() => {
    // 1. Cấm menu chuột phải (Right Click)
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    // 2. Cấm các phím tắt mở DevTools (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U...)
    const handleKeyDown = (e) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'J') ||
        (e.ctrlKey && e.key === 'U')
      ) {
        e.preventDefault();
      }
    };

    // 3. "Debugger Trap" - Làm treo trình duyệt nếu mở F12
    // Kỹ thuật này sẽ spam lệnh 'debugger'. Nếu DevTools đóng, nó không sao.
    // Nếu DevTools mở, trình duyệt sẽ liên tục dừng tại dòng này, làm hacker không thao tác được.
    const loopDebugger = () => {
      (function () {
        // Sử dụng hàm nặc danh để tránh bị tìm thấy tên
        try {
          (function a() {
            // Check xem DevTools có mở không dựa trên độ lệch thời gian (trick)
            const start = new Date().getTime();
            debugger; // <--- Dòng này sẽ pause code nếu F12 đang mở
            const end = new Date().getTime();

            // Nếu thời gian chênh lệch > 10ms, nghĩa là debugger đã kích hoạt (DevTools đang mở)
            if (end - start > 10) {
              // Có thể chèn code xóa body để màn hình trắng trơn
              document.body.innerHTML = '<div>Đừng táy máy F12 bạn ơi!</div>';
            }
          })();
        } catch (e) { }
      })();
    };

    // Chạy loop kiểm tra liên tục
    const intervalId = setInterval(loopDebugger, 1000);

    // Gắn sự kiện
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup khi component unmount
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      clearInterval(intervalId);
    };
  }, []);
  return (
    <div className={styles.App}>
      <header className={styles.Header}>
        <img className={styles.Logo} src="/show.png" />
        <h2 className={styles.Title}>AI Chatbot</h2>
      </header>

      <div className={styles.Content}>
        <Sidebar
          chats={chats}
          activeChatId={activeChatId}
          activeChatMessages={activeChatMessages}
          onActiveChatIdChange={handleActiveChatIdChange}
          onNewChatCreate={handleNewChatCreate}
        />

        <main className={styles.Main}>
          {chats.map((chat) => (
            <Chat
              key={chat.id}
              assistant={assistant}
              isActive={chat.id === activeChatId}
              chatId={chat.id}
              chatMessages={chat.messages}
              onChatMessagesUpdate={handleChatMessagesUpdate}
            />
          ))}

          <div className={styles.Configuration}>
            <Assistant onAssistantChange={handleAssistantChange} />
            <Theme />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;