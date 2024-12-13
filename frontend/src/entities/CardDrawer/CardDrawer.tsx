import { CardDto, EntityId } from "@dto/interfaces";
import { Xmark } from "@gravity-ui/icons";
import { Drawer, DrawerItem } from "@gravity-ui/navigation";
import { Button, Flex, Icon, Label } from "@gravity-ui/uikit";
import { useUnit } from "effector-react";
import React, { useContext, useState } from "react";
import { cardApi } from "src/features/Card/model";
import { $lists } from "src/features/List/model";
import { EditableText } from "src/shared/EditableText/EditableText";

import styles from "./CardDrawer.module.css";
import { Editor } from "./Editor/Editor";

const DrawerContext = React.createContext<{
  openCardId?: EntityId | null;
  setOpenCardId?: (id: EntityId | null) => void;
}>({});

export const DrawerContextProvider = ({
  children,
}: React.PropsWithChildren) => {
  const [openCardId, setOpenCardId] = useState<EntityId | null>(null);
  const value = {
    openCardId,
    setOpenCardId,
  };

  return (
    <DrawerContext.Provider value={value}>{children}</DrawerContext.Provider>
  );
};

export const useDrawerContext = () => {
  const context = useContext(DrawerContext);

  if (!context) {
    throw new Error(
      "useDrawerContext must be used within a DrawerContextProvider",
    );
  }

  return context;
};

type CardDrawerProps = {};

export const CardDrawer: React.FC<CardDrawerProps> = () => {
  const { openCardId, setOpenCardId } = useDrawerContext();
  const [width, setWidth] = React.useState(400);
  const { cards, changeCard } = useUnit(cardApi);
  const lists = useUnit($lists);

  if (!openCardId) {
    return;
  }

  const card: CardDto | undefined = cards[openCardId];

  if (!card) {
    return;
  }

  return (
    <Drawer
      onEscape={() => setOpenCardId?.(null)}
      onVeilClick={() => setOpenCardId?.(null)}
      hideVeil={true}
    >
      <DrawerItem
        id="cardDrawer"
        className={styles.drawer}
        visible={openCardId !== null}
        resizable={true}
        width={width}
        onResize={setWidth}
        direction="right"
      >
        <Flex direction="column" gap={6}>
          <Flex justifyContent="space-between" alignItems="center">
            <Label>{lists[card.listId].name}</Label>
            <Button onClick={() => setOpenCardId?.(null)}>
              <Icon data={Xmark} />
            </Button>
          </Flex>
          <EditableText
            id={`${String(card.id)}drawer`}
            value={card.text ?? ""}
            onChange={(event) => {
              changeCard({
                cardId: card.id,
                changes: { text: event.target.value },
              });
            }}
            variant="display-1"
          />
          <Editor
            updateText={(text) =>
              changeCard({
                cardId: openCardId,
                changes: {
                  description: text ?? "",
                },
              })
            }
            defaultValue={card.description ?? ""}
          />
        </Flex>
      </DrawerItem>
    </Drawer>
  );
};
