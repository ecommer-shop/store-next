"use client"

import { SignedIn, UserProfile, useSession } from "@clerk/nextjs"
import { Button, AlertDialog } from "@heroui/react"
import { useTheme } from "next-themes"
import { dark } from "@clerk/themes"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"
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
      <div className="space-y-6 p-6">
        {/* Clerk UserProfile Component */}
        <div className="rounded-xl overflow-hidden">
          <UserProfile
            routing="path"
            path={`/${locale}/account/profile`}
            appearance={{
              baseTheme: resolvedTheme === "dark" ? dark : undefined,
              variables: {
                borderRadius: "12px",
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
                fontSize: "14px",
              },
              elements: {
                card: {
                  background: "transparent",
                  boxShadow: "none",
                  border: "none",
                  padding: 0,
                },
                rootBox: {
                  width: "100%",
                },
                navbar: {
                  background: resolvedTheme === "dark"
                    ? "rgba(153,105,248,0.08)"
                    : "rgba(153,105,248,0.06)",
                  borderRight: "1px solid rgba(153,105,248,0.2)",
                  borderRadius: "12px 0 0 12px",
                  padding: "16px",
                },
                navbarButton: {
                  borderRadius: "8px",
                  padding: "10px 12px",
                  fontSize: "14px",
                  fontWeight: "500",
                  transition: "all 0.2s ease",
                },
                navbarButton__active: {
                  background: "linear-gradient(90deg, #9969F8, #6BB8FF)",
                  color: "#ffffff",
                  fontWeight: "600",
                },
                pageScrollBox: {
                  padding: "32px 24px",
                  background: resolvedTheme === "dark" ? "transparent" : "#fafafa",
                },
                profileSection: {
                  borderBottom: "1px solid rgba(153,105,248,0.15)",
                  paddingBottom: "24px",
                  marginBottom: "24px",
                },
                profileSectionTitle: {
                  fontSize: "16px",
                  fontWeight: "600",
                  color: resolvedTheme === "dark" ? "#F1F1F1" : "#12123F",
                  marginBottom: "12px",
                },
                profileSectionPrimaryButton: {
                  background: "linear-gradient(90deg, #9969F8, #6BB8FF)",
                  color: "#ffffff",
                  borderRadius: "8px",
                  border: "none",
                  padding: "10px 16px",
                  fontSize: "14px",
                  fontWeight: "600",
                  transition: "all 0.2s ease",
                },
                badge: {
                  background: "rgba(107,184,255,0.15)",
                  color: "#6BB8FF",
                  border: "1px solid rgba(107,184,255,0.3)",
                  borderRadius: "6px",
                  padding: "4px 8px",
                  fontSize: "12px",
                  fontWeight: "600",
                },
                formButtonPrimary: {
                  background: "linear-gradient(90deg, #9969F8, #6BB8FF)",
                  color: "#ffffff",
                  borderRadius: "8px",
                  padding: "10px 20px",
                  fontSize: "14px",
                  fontWeight: "600",
                },
                formFieldInput: {
                  background: resolvedTheme === "dark" ? "#1a1a45" : "#f5f3ff",
                  border: "1px solid rgba(153,105,248,0.3)",
                  color: resolvedTheme === "dark" ? "#F1F1F1" : "#12123F",
                  borderRadius: "8px",
                  padding: "10px 12px",
                  fontSize: "14px",
                },
                formFieldLabel: {
                  fontSize: "13px",
                  fontWeight: "600",
                  color: resolvedTheme === "dark" ? "#F1F1F1" : "#12123F",
                  marginBottom: "6px",
                },
                modalContent: {
                  background: resolvedTheme === "dark" ? "#0f0f2e" : "#ffffff",
                  borderRadius: "16px",
                  border: "1px solid rgba(153,105,248,0.25)",
                  padding: "24px",
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
        </div>

        {/* Delete Account Section */}
        <div className="relative rounded-xl overflow-hidden border border-red-500/30 dark:border-red-500/40 bg-gradient-to-br from-red-50 via-red-50/50 to-red-100/30 dark:from-red-950/30 dark:via-red-950/20 dark:to-red-900/10 backdrop-blur-sm shadow-lg shadow-red-500/5">
          {/* Decorative corner glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative p-6 space-y-4">
            {/* Header */}
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                {t(I18N.Account.profile.deleteAccount.title)}
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300/80 leading-relaxed">
                {t(I18N.Account.profile.deleteAccount.description)}
              </p>
            </div>

            {/* Action Button */}
            <Button
              variant="danger"
              className="rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200"
              onPress={() => setDeleteDialogOpen(true)}
            >
              {t(I18N.Account.profile.deleteAccount.action)}
            </Button>
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        <AlertDialog isOpen={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialog.Backdrop variant="blur" style={{ height: "100%" }}>
            <AlertDialog.Container>
              <AlertDialog.Dialog className="w-sm rounded-xl shadow-2xl">
                <AlertDialog.CloseTrigger />
                <AlertDialog.Header className="pb-4">
                  <AlertDialog.Heading className="flex items-start gap-3">
                    <div className="shrink-0 w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center">
                      <AlertDialog.Icon status="danger" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-2">
                        {t(I18N.Account.profile.deleteAccount.warningTitle)}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {t(I18N.Account.profile.deleteAccount.warningDescription)}
                      </p>
                    </div>
                  </AlertDialog.Heading>
                </AlertDialog.Header>
                <AlertDialog.Footer className="flex gap-3 pt-4">
                  <Button
                    className="rounded-lg flex-1"
                    slot="close"
                    variant="flat"
                    isDisabled={isDeleting}
                  >
                    {t(I18N.Account.profile.deleteAccount.cancel)}
                  </Button>
                  <Button
                    className="rounded-lg flex-1 font-semibold"
                    variant="danger"
                    onPress={handleDeleteAccount}
                    isDisabled={isDeleting}
                    isLoading={isDeleting}
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
