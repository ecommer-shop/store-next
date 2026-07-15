"use client";

import { Users } from "lucide-react";
import { UseAboutText } from "./UseAboutText";

const groups = [
  {
    key: "leadership",
    members: ["ceo", "accountant", "serverLead", "eiaLead", "lawyer"],
  },
] as const;

export function TeamSection() {
  return (
    <section className="bg-muted/30 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <Users className="size-10 mx-auto mb-4 text-primary" />
          <h2 className="text-3xl font-bold">
            <UseAboutText path={["team", "title"]} />
          </h2>
        </div>

        <div className="max-w-xl mx-auto space-y-8">
          {groups.map((group) => (
            <div key={group.key}>
              <div className="divide-y border rounded-lg bg-background">
                {group.members.map((member) => (
                  <div
                    key={member}
                    className="flex items-center gap-4 px-6 py-4"
                  >
                    <div className="size-2 rounded-full bg-primary shrink-0" />
                    <span className="font-medium">
                      <UseAboutText path={["team", group.key, member]} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
