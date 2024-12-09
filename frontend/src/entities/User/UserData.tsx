import { Person, ShieldExclamation } from "@gravity-ui/icons";
import { User } from "@gravity-ui/uikit";
import { useUnit } from "effector-react";
import React from "react";
import { Link } from "react-router";
import { Routes } from "src/App";

import { userApi } from "./model";
import styles from "./User.module.css";
const AvatarPlaceholder = (avatarProps: any) => (
  <Person {...avatarProps} width={32} height={32} />
);

interface UserProps {
  username: string;
  avatar?: string;
}

export const UserData: React.FC<UserProps> = ({ username, avatar }) => {
  return (
    <Link to={Routes.login}>
      <User
        name={username}
        avatar={
          avatar ? (
            {
              imgUrl: avatar,
            }
          ) : (
            <AvatarPlaceholder />
          )
        }
      />
    </Link>
  );
};
