import { useEffect, useState } from "react";
import styles from "./Theme.module.css";
//import { useEffect, useState } from "@chakra-ui/react"

export function Theme() {
    const [theme, setTheme] = useState("system");

    useEffect(() => {
        const root = document.documentElement;

        if (theme === "system") {
            root.removeAttribute("data-theme");
        } else {
            root.setAttribute("data-theme", theme);
        }
    }, [theme]);

    return (
        <div className={styles.Theme}>
            <span className={styles.Label}>Theme:</span>
            <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className={styles.Select}
            >
                <option value="system">System</option>
                <option value="dark">Dark</option>
            </select>
        </div>
    );
}
