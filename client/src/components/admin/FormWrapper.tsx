import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Link } from "wouter";

interface FormWrapperProps {
  title: string;
  description?: string;
  children: ReactNode;
  isPending?: boolean;
  onSubmit: () => void;
  cancelHref: string;
  submitLabel?: string;
  cancelLabel?: string;
  footerContent?: ReactNode;
}

export function FormWrapper({
  title,
  description,
  children,
  isPending = false,
  onSubmit,
  cancelHref,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  footerContent,
}: FormWrapperProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
        <CardContent>{children}</CardContent>
        <CardFooter className="flex justify-between border-t px-6 py-4">
          <div className="flex items-center gap-2">
            <Link href={cancelHref}>
              <Button variant="outline" type="button" disabled={isPending}>
                {cancelLabel}
              </Button>
            </Link>
            {footerContent}
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {submitLabel}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}