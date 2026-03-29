"use client"

import { SignedIn, UserProfile, useSession, useUser } from "@clerk/nextjs"
import { Button, AlertDialog } from "@heroui/react"
import { useTheme } from "next-themes"
import { dark } from "@clerk/themes"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { deleteAccountAction } from "./actions"
import { I18N } from "@/i18n/keys"

export default function UserProfileClient() {
  const { resolvedTheme } = useTheme()
  
  const locale = useLocale()
  const router = useRouter()
  const t = useTranslations("Account.profile")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, startDeleteTransition] = useTransition()
  const { session, isLoaded, isSignedIn } = useSession();
  // Validar que Clerk ya cargó los datos
  if (!isLoaded) {
    return <div>Cargando...</div>;
  }

  // Validar que realmente hay una sesión activa
  if (!isSignedIn) {
    return <div>No has iniciado sesión</div>;
  }
  const handleDeleteAccount = () => {
    startDeleteTransition(async () => {
      try {
        const result = await deleteAccountAction();

        if (!result.success) {
          toast.error(t(I18N.Account.profile.deleteAccount.errorTitle), {
            description: result.message,
          })
          return
        }

        toast.success(t(I18N.Account.profile.deleteAccount.successTitle), {
          description: result.message,
        })
        setDeleteDialogOpen(false)
        router.replace(`/${locale}`)
        router.refresh()
      } catch (error) {
        toast.error(t(I18N.Account.profile.deleteAccount.errorTitle), {
          description: error instanceof Error ? error.message : "Unknown error",
        })
      }
    })
  }

  return (
    <SignedIn>
      <div className="space-y-6">
        <UserProfile
          routing="path"
          path={`/${locale}/account/profile`}
          appearance={{
            baseTheme: resolvedTheme === "dark" ? dark : undefined,
            variables: {
                borderRadius: "2px",
                colorBackground: resolvedTheme === "dark" ? "#12123F" : "#F1F1F1",
                colorShadow: resolvedTheme === "dark" ? "#F1F1F1" : "#12123f",
            },
            elements: {
              modalContent: {
                background: resolvedTheme === "dark" ? "#12123F" : "#F1F1F1",
                borderRadius: "2px",
              },
              modalBackdrop: {
                "&::backdrop": {
                  height: "100%",
                  width: "100%"
                }
              }
            },
          }}
        />

        <Card className="border-red-500/40 rounded-md">
          <CardHeader className="flex flex-col gap-2">
            <CardTitle>{t(I18N.Account.profile.deleteAccount.title)}</CardTitle>
            <CardDescription>{t(I18N.Account.profile.deleteAccount.description)}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="danger-soft"
              className="rounded-md"
              onPress={() => setDeleteDialogOpen(true)}
            >
              {t(I18N.Account.profile.deleteAccount.action)}
            </Button>
          </CardContent>
        </Card>

        <AlertDialog isOpen={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialog.Backdrop variant="blur" style={{ height: "100%" }}>
            <AlertDialog.Container>
              <AlertDialog.Dialog className="w-sm rounded-md">
                <AlertDialog.CloseTrigger />
                <AlertDialog.Header>
                  <AlertDialog.Heading>
                    <AlertDialog.Icon status="danger" />
                    {t(I18N.Account.profile.deleteAccount.warningTitle)}
                  </AlertDialog.Heading>
                  <p className="text-sm text-muted-foreground mt-2">
                    {t(I18N.Account.profile.deleteAccount.warningDescription)}
                  </p>
                </AlertDialog.Header>
                <AlertDialog.Footer>
                  <Button
                    className="rounded-md"
                    slot="close"
                    variant="danger-soft"
                    isDisabled={isDeleting}
                  >
                    {t(I18N.Account.profile.deleteAccount.cancel)}
                  </Button>
                  <Button
                    className="rounded-md"
                    variant="danger"
                    onPress={handleDeleteAccount}
                    isDisabled={isDeleting}
                  >
                    {isDeleting
                      ? t(I18N.Account.profile.deleteAccount.deleting)
                      : t(I18N.Account.profile.deleteAccount.confirm)}
                  </Button>
                </AlertDialog.Footer>
              </AlertDialog.Dialog>
            </AlertDialog.Container>
          </AlertDialog.Backdrop>
        </AlertDialog>
      </div>
    </SignedIn>
  )
}
