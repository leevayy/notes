import {
  Alert,
  Button,
  Card,
  Container,
  Flex,
  TextInput,
} from "@gravity-ui/uikit";
import { useUnit } from "effector-react";
import { userApi } from "src/entities/User/model";

import styles from "./ProfilePage.module.css";
interface ProfilePageProps {}

export const ProfilePage: React.FC<ProfilePageProps> = () => {
  const { user } = useUnit(userApi);
  const isDisabled = true;

  return (
    <Container maxWidth="m" className={styles.wrapper}>
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
    </Container>
  );
};
