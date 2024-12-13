import { ArrowRightFromSquare, Bars, Calendar } from "@gravity-ui/icons";
import {
  Button,
  Flex,
  Icon,
  Popup,
  RadioButton,
  Text,
} from "@gravity-ui/uikit";
import { useUnit } from "effector-react";
import { t } from "i18next";
import { useRef, useState } from "react";
import { userApi } from "src/entities/User/model";
import { UserData } from "src/entities/User/UserData";
import { themeApi } from "src/shared/model";
import { State } from "src/shared/StateModel/model";

import styles from "./Header.module.css";

type HeaderProps = {
  boardName: string;
};

export function Header({ boardName }: HeaderProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const { user, logoutUser } = useUnit(userApi);
  const { theme, changeTheme } = useUnit(themeApi);

  return (
    <header className={styles.header}>
      <div className={styles.group}>
        <div ref={buttonRef}>
          <Button
            view="flat"
            className={styles.button}
            onClick={() => setIsOpen(!isOpen)}
          >
            <Icon data={Bars} size="32" />
          </Button>
        </div>
        <Icon data={Calendar} size="32" />
        <RadioButton
          size="l"
          options={[
            {
              value: "light",
              title: t("theme_light"),
              content: t("theme_light"),
            },
            {
              value: "dark",
              title: t("theme_dark"),
              content: t("theme_dark"),
            },
          ]}
          value={theme}
          onUpdate={(theme) => changeTheme(theme)}
        />
      </div>
      <div className={styles.group}>
        <Text variant="header-1">{boardName}</Text>
      </div>
      <div className={styles.group}>
        {user.id !== 0 && <UserData username={user?.name ?? t("login")} />}
      </div>
      <Popup
        open={isOpen}
        anchorRef={buttonRef}
        placement="bottom-start"
        className={styles.popup}
        onClose={() => setIsOpen(false)}
      >
        <Flex direction="column">
          <Button
            view="flat"
            onClick={() => {
              logoutUser();
            }}
            loading={user.logoutUserState === State.loading}
            disabled={
              user.logoutUserState === State.loading ||
              user.logoutUserState === State.success
            }
          >
            <Icon data={ArrowRightFromSquare} />
            {t("logout")}
          </Button>
        </Flex>
      </Popup>
    </header>
  );
}
