import {
  Alert,
  Button,
  Card,
  Container,
  Flex,
  Link,
  Modal,
  Spin,
  Text,
  TextInput,
} from "@gravity-ui/uikit";
import { useUnit } from "effector-react";
import { t } from "i18next";
import { useState } from "react";
import { createBoardFx, userApi } from "src/entities/User/model";

import styles from "./ProfilePage.module.css";
interface ProfilePageProps {}

export const ProfilePage: React.FC<ProfilePageProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");
  const isPending = useUnit(createBoardFx.pending);
  const { user, addBoard } = useUnit(userApi);
  const isDisabled = true;

  return (
    <>
      <Container maxWidth="m" className={styles.wrapper}>
        <Flex direction="column" gap={8}>
          <Card className={styles.card}>
            <Flex direction="column" gap={4}>
              <TextInput
                value={user.name}
                placeholder="displayed name"
                disabled={isDisabled}
              />
              <Button disabled={isDisabled}>Submit</Button>
              <Alert
                title="View only"
                message="No profile editing is implemented yet"
              />
            </Flex>
          </Card>
          <Flex direction="column" gap={4} alignItems="center">
            <Text variant="header-1">{t("your_boards")}</Text>
            {!isPending ? (
              <div className={styles.boards}>
                {user.boards.map((board) => (
                  <Link href={`/project/${board.id}`} key={board.id}>
                    <Card>
                      <Flex centerContent={true} style={{ height: "40px" }}>
                        {board.name}
                      </Flex>
                    </Card>
                  </Link>
                ))}
                <Button
                  onClick={() => {
                    setIsOpen(true);
                  }}
                >
                  {t("create_new_board")}
                </Button>
              </div>
            ) : (
              <Spin />
            )}
          </Flex>
        </Flex>
      </Container>
      <Modal open={isOpen} onClose={() => setIsOpen(false)}>
        <Card className={styles.newBoardModal}>
          <Flex direction="column" gap={4}>
            <TextInput
              placeholder={t("board_name")}
              value={newBoardName}
              onChange={(event) => {
                setNewBoardName(event.target.value);
              }}
            />
            <Button
              onClick={() => {
                addBoard({ name: newBoardName });
                setIsOpen(false);
              }}
            >
              {t("create_new_board")}
            </Button>
          </Flex>
        </Card>
      </Modal>
    </>
  );
};
