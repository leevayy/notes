import {
  Button,
  Card,
  Container,
  Flex,
  List,
  Modal,
  RadioButton,
  TextInput,
} from "@gravity-ui/uikit";
import { useUnit } from "effector-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { userApi } from "src/entities/User/model";
import { State } from "src/shared/StateModel/model";

interface AuthPageProps {}

export const AuthPage: React.FC<AuthPageProps> = () => {
  const { user, loginUser, registerUser } = useUnit(userApi);

  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isRegistred, setIsRegistred] = useState(true);
  const [username, setUsername] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const isDisabled =
    user.loginUserState === State.loading ||
    user.registerUserState === State.loading ||
    user.loginUserState === State.success ||
    user.registerUserState === State.success;

  const navigate = useNavigate();

  useEffect(() => {
    if (
      (user.loginUserState === State.success ||
        user.registerUserState === State.success) &&
      user.logoutUserState !== State.success
    ) {
      setIsModalOpen(true);
      setTimeout(() => navigate("/project"), 2000);
    }
  }, [user, navigate]);

  const onSubmit = () => {
    setValidationErrors([]);

    if (login.length < 4) {
      setValidationErrors((prev) => [...prev, "LOGIN_LENGTH_ERROR"]);
    }

    if (password.length < 8) {
      setValidationErrors((prev) => [...prev, "PASSWORD_LENGTH_ERROR"]);
    }

    const numberCount = password.match(/[0-9]/g)?.length ?? 0;

    if (numberCount < 2) {
      setValidationErrors((prev) => [...prev, "PASSWORD_NUMBERS_ERROR"]);
    }

    const lowercaseLetterCount = password.match(/[a-z]/g)?.length ?? 0;

    if (lowercaseLetterCount < 2) {
      setValidationErrors((prev) => [
        ...prev,
        "PASSWORD_LOWERCASE_LETTERS_ERROR",
      ]);
    }

    const uppercaseLetterCount = password.match(/[A-Z]/g)?.length ?? 0;

    if (uppercaseLetterCount < 2) {
      setValidationErrors((prev) => [
        ...prev,
        "PASSWORD_UPPERCASE_LETTERS_ERROR",
      ]);
    }

    const specialCharactersCount = password.match(/[^A-Za-z0-9]/g)?.length ?? 0;

    if (specialCharactersCount < 2) {
      setValidationErrors((prev) => [
        ...prev,
        "PASSWORD_SPECIAL_CHARACTERS_ERROR",
      ]);
    }

    if (username.length < 4) {
      setValidationErrors((prev) => [...prev, "USERNAME_LENGTH_ERROR"]);
    }

    if (password !== confirmPassword) {
      setValidationErrors((prev) => [...prev, "PASSWORD_MATCH_ERROR"]);
    }

    if (isRegistred) {
      loginUser({ login, password });
    }

    if (!isRegistred && validationErrors.length === 0) {
      registerUser({ name: username, login, password });
    }

    setUsername("");
    setLogin("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <Container maxWidth="m">
      <Card style={{ minWidth: "400px" }}>
        <Flex direction="column" gap={4}>
          {!isRegistred && (
            <TextInput
              value={username}
              placeholder="displayed name"
              onChange={(event) => setUsername(event.target.value)}
              disabled={isDisabled}
            />
          )}
          <TextInput
            value={login}
            placeholder="login"
            onChange={(event) => setLogin(event.target.value)}
            disabled={isDisabled}
            autoComplete="username"
          />
          <TextInput
            value={password}
            placeholder="password"
            onChange={(event) => setPassword(event.target.value)}
            disabled={isDisabled}
            type="password"
            autoComplete="password"
          />
          {!isRegistred && (
            <TextInput
              value={confirmPassword}
              placeholder="confirm password"
              onChange={(event) => setConfirmPassword(event.target.value)}
              type="password"
              disabled={isDisabled}
            />
          )}
          <Button onClick={onSubmit} disabled={isDisabled} loading={isDisabled}>
            Submit
          </Button>
          <RadioButton
            value={isRegistred ? "login" : "register"}
            onUpdate={(value) => setIsRegistred(value === "login")}
            options={[
              { value: "login", content: "login" },
              { value: "register", content: "register" },
            ]}
            disabled={isDisabled}
          />
        </Flex>
        {!isRegistred && (
          <List
            items={validationErrors}
            virtualized={false}
            filterable={false}
          />
        )}
      </Card>
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        In 2 seconds you will be redirected to the project page
      </Modal>
    </Container>
  );
};
