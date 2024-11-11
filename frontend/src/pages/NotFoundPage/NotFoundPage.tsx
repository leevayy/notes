import { Ghost } from "@gravity-ui/icons";
import { Container, Flex, Text } from "@gravity-ui/uikit";

type NotFoundPageProps = {};

export const NotFoundPage: React.FC<NotFoundPageProps> = () => {
  return (
    <Container>
      <Flex direction="column" gap={4} centerContent={true}>
        <Ghost />
        <Text variant="display-1">Not found</Text>
      </Flex>
    </Container>
  );
};
