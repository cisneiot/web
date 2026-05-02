export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5 text-primary-foreground"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2C10.5 4 8 6 6 7C4 8 3 9.5 3 12C3 14.5 4.5 17 7 19C9.5 21 11 22 12 22C13 22 14.5 21 17 19C19.5 17 21 14.5 21 12C21 9.5 20 8 18 7C16 6 13.5 4 12 2Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <span className="font-semibold text-foreground">CisneIoT</span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} CisneIoT. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
