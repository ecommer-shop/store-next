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
              borderRadius: "8px",
              colorBackground: resolvedTheme === "dark" ? "#0f0f2e" : "#ffffff",
              colorText: resolvedTheme === "dark" ? "#F1F1F1" : "#12123F",
              colorTextSecondary: "#9969F8",
              colorPrimary: "#9969F8",
              colorNeutral: resolvedTheme === "dark" ? "#9969F8" : "#12123F",
              colorInputBackground: resolvedTheme === "dark" ? "#1a1a45" : "#f5f3ff",
              colorInputText: resolvedTheme === "dark" ? "#F1F1F1" : "#12123F",
              colorShadow: resolvedTheme === "dark"
                ? "0 8px 32px rgba(153,105,248,0.2), 0 2px 8px rgba(0,0,0,0.5)"
                : "0 8px 32px rgba(153,105,248,0.12), 0 2px 8px rgba(18,18,63,0.08)",
              fontFamily: "inherit",
              fontWeight: { normal: 400, medium: 500, bold: 700 },
            },
            elements: {
              card: {
                background: "transparent",
                boxShadow: "none",
                border: "none",
              },
              navbar: {
                background: resolvedTheme === "dark"
                  ? "rgba(153,105,248,0.08)"
                  : "rgba(153,105,248,0.06)",
                borderRight: "1px solid rgba(153,105,248,0.2)",
              },
              navbarButton: {
                borderRadius: "6px",
              },
              navbarButton__active: {
                background: "linear-gradient(90deg, #9969F8, #6BB8FF)",
                color: "#ffffff",
              },
              pageScrollBox: {
                padding: "24px",
              },
              profileSection: {
                borderBottom: "1px solid rgba(153,105,248,0.15)",
              },
              profileSectionPrimaryButton: {
                background: "linear-gradient(90deg, #9969F8, #6BB8FF)",
                color: "#ffffff",
                borderRadius: "6px",
                border: "none",
              },
              badge: {
                background: "rgba(107,184,255,0.15)",
                color: "#6BB8FF",
                border: "1px solid rgba(107,184,255,0.3)",
              },
              formButtonPrimary: {
                background: "linear-gradient(90deg, #9969F8, #6BB8FF)",
                color: "#ffffff",
                borderRadius: "6px",
              },
              formFieldInput: {
                background: resolvedTheme === "dark" ? "#1a1a45" : "#f5f3ff",
                border: "1px solid rgba(153,105,248,0.3)",
                color: resolvedTheme === "dark" ? "#F1F1F1" : "#12123F",
                borderRadius: "6px",
              },
              modalContent: {
                background: resolvedTheme === "dark" ? "#0f0f2e" : "#ffffff",
                borderRadius: "12px",
                border: "1px solid rgba(153,105,248,0.25)",
              },
              modalBackdrop: {
                background: "rgba(0,0,0,0.5)",
                backdropFilter: "blur(8px)",
              },
              footer: {
                display: "none",
              },
            },
          }}
        />

        <Card className="border border-red-500/30 bg-red-950/20 backdrop-blur-sm rounded-xl">
          <CardHeader className="flex flex-col gap-2">
            <CardTitle className="text-red-400">{t(I18N.Account.profile.deleteAccount.title)}</CardTitle>
            <CardDescription className="text-red-300/70">{t(I18N.Account.profile.deleteAccount.description)}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="danger-soft"
              className="rounded-lg border border-red-500/40 hover:bg-red-600/20"
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
