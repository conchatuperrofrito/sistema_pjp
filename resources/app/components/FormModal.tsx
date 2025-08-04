import { FC, ReactNode } from "react";
import clsx from "clsx";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Skeleton,
  Button,
  Tabs,
  Tab
} from "@heroui/react";

import { generateUniqueId } from "@/utils/stringUtils";
import "@/css/components/FormModal.css";
import CarouselFormContainer, { CarouselItem } from "./CarouselFormContainer";
import { FloppyDiskIcon, XmarkSolidIcon } from "@/assets/icons";

interface BaseFormModalProps extends FormModalConfig{
  isOpen: boolean;
  onOpenChange: () => void;
  onClose?: () => void;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "xs" | "3xl" | "4xl" | "5xl" | "full" | undefined;
  scrollBehavior?: "normal" | "inside" | "outside" | undefined;
  className?: string;
  classNameFooter?: string;
  isMobile?: boolean;
}

interface WizardConfig {
  tabs: {title: string, key: string}[];
  ariaLabel: string;
}

interface MultiFormModalProps extends BaseFormModalProps {
  modalVariant: "multi";
  selectedForm: string;
  forms: CarouselItem[];
}

interface WizardFormModalProps extends BaseFormModalProps {
  modalVariant: "wizard";
  wizardConfig: WizardConfig;
  selectedForm: string;
  forms: CarouselItem[];
}

interface NormalFormModalProps extends BaseFormModalProps {
  modalVariant?: "normal";
  children: ReactNode;
}

type FormModalProps = WizardFormModalProps | MultiFormModalProps | NormalFormModalProps;

export const FormModal: FC<FormModalProps> = ({
  isOpen,
  onOpenChange,
  isLoading,
  isSaving,
  onSubmit,
  title,
  skeletonForm,
  onClose,
  size="xl",
  customCloseButton = { show: true },
  customSaveButton = { show: true, color: "success" },
  onModalClose,
  extraContentTop,
  extraContentFooter,
  extraButtonFooter,
  extraButtonFooterPosition = "start",
  scrollBehavior,
  classNameFooter = "",
  className,
  isMobile = false,
  classNameHeader = "",
  ...props
}) => {
  const { modalVariant } = props;

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="center"
      isDismissable={false}
      hideCloseButton={isSaving}
      onClose={onClose}
      size={size}
      classNames={{
        closeButton: "p-0 m-0",
        base: size === "full" ? "my-auto" : undefined,
        footer: `sticky bottom-0 bg-content1 ${classNameFooter}`,
        wrapper: size === "full" ? "items-start h-auto" : undefined
      }}
      motionProps={{
        variants: {
          enter: {
            opacity: 1,
            transition: {
              opacity: {
                duration: 0.3,
                ease: "easeOut"
              }
            }
          },
          exit: {
            opacity: 0,
            transition: {
              duration: 0.3
            }
          }
        }
      }}
      closeButton={
        <div>
          <Button
            style={{
              padding: "8px",
              border: "none",
              fontSize: "16px"
            }}
            variant="light"
            onPress={() => {
              if (onModalClose){
                onModalClose();
              } else {
                onOpenChange();
              }
            }}
            isIconOnly
            radius="full"
          >
            <svg aria-hidden="true" fill="none" focusable="false"
              height="1em" role="presentation" stroke="currentColor"
              strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              viewBox="0 0 24 24" width="1em">
              <path d="M18 6L6 18M6 6l12 12"></path>
            </svg>
          </Button>
        </div>
      }
      scrollBehavior={scrollBehavior}
      className={className}
    >
      <ModalContent className={"!my-0"}>
        {(onClose) => (
          <>
            <ModalHeader className="pb-1">
              <div className={classNameHeader}>
                {modalVariant === "wizard" ?
                  isMobile ? (
                    <>
                      {props.wizardConfig.tabs.find(({ key }) =>
                        key === props.selectedForm)?.title
                      }
                    </>
                  ) : (
                    <Tabs
                      aria-label={props.wizardConfig?.ariaLabel}
                      selectedKey={props.selectedForm}
                      color="primary"
                    >
                      {
                        props.wizardConfig.tabs.map(({ title, key }) =>
                          <Tab title={title} key={key} />
                        )
                      }
                    </Tabs>
                  )
                  : <>{ title }</>
                }
                {extraContentTop}
              </div>
            </ModalHeader>
            <ModalBody className={`gap-0 pb-0 ${size === "full" ? "overflow-y-auto" : ""}`}>
              <form
                className="flex flex-col"
                onSubmit={onSubmit}
                id={`modal-form-${generateUniqueId(title)}`}
              >
                {isLoading && skeletonForm && skeletonForm}
                <div className={(isLoading && skeletonForm) ? "hidden" : ""}>
                  {
                    modalVariant === "multi" || modalVariant === "wizard" ? (
                      <CarouselFormContainer
                        selectedForm={props.selectedForm}
                        forms={props.forms}
                        isFullScreen={size === "full"}
                      />
                    ) : props.children
                  }
                </div>
              </form>
            </ModalBody>
            <ModalFooter className="pt-2 z-10">
              {extraContentFooter}
              {isLoading ? (
                <>
                  {
                    customCloseButton?.show && (
                      <Skeleton className="w-[105px] h-[40px] rounded-medium" />
                    )
                  }
                  {
                    customSaveButton?.show && (
                      <Skeleton className="w-[105px] h-[40px] rounded-medium" />
                    )
                  }
                </>
              ) : (
                <>
                  <div className="flex gap-2">
                    <div className={clsx({
                      "order-1": extraButtonFooterPosition === "start",
                      "order-2": extraButtonFooterPosition === "center",
                      "order-3": extraButtonFooterPosition === "end"
                    })}>
                      {extraButtonFooter}
                    </div>
                    {
                      customCloseButton?.show && (
                        <Button
                          variant="flat"
                          onPress={ customCloseButton.onClick || onClose }
                          isDisabled={isSaving}
                          className={clsx(
                            `w-[105px] ${customCloseButton.className}`,
                            {
                              "order-2": extraButtonFooterPosition === "start",
                              "order-1":
                              extraButtonFooterPosition === "center" ||
                              extraButtonFooterPosition === "end"
                            }
                          )}
                          startContent={ customCloseButton.startContent }
                          endContent={
                            customCloseButton.endContent || <XmarkSolidIcon className="text-[16px]" />
                          }
                        >
                          { customCloseButton.content || "Cancelar" }
                        </Button>
                      )
                    }

                    {
                      customSaveButton?.show && (
                        <Button
                          color={customSaveButton.color}
                          type="submit"
                          form={`modal-form-${generateUniqueId(title)}`}
                          isLoading={isSaving}
                          spinnerPlacement="end"
                          startContent={ customSaveButton.startContent }
                          endContent={
                            !isSaving &&
                             ( customSaveButton.endContent ||
                             <FloppyDiskIcon className="text-[16px]" />
                             )
                          }
                          className={clsx("w-[105px]",{
                            "order-3":
                            extraButtonFooterPosition === "start" ||
                            extraButtonFooterPosition === "center",
                            "order-2": extraButtonFooterPosition === "end"
                          })}
                        >
                          { customSaveButton.content || "Guardar"}
                        </Button>
                      )
                    }
                  </div>
                </>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
