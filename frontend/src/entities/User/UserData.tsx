import { Person } from "@gravity-ui/icons";
import { User } from "@gravity-ui/uikit";
import React from "react";
import { Link } from "react-router";
import { Routes } from "src/App";

const AvatarPlaceholder = (avatarProps: any) => (
  <Person {...avatarProps} width={32} height={32} />
);

interface UserProps {
  username: string;
  avatar?: string;
}

export const UserData: React.FC<UserProps> = ({ username, avatar }) => {
  return (
    <Link
      style={{
        color: "inherit",
      }}
      to={Routes.profile}
    >
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
