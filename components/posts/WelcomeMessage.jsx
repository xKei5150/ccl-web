export function WelcomeMessage() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4 text-center">
      <h2 className="text-2xl font-semibold tracking-tight">Welcome to Posts</h2>
      <p className="text-muted-foreground">
        Select a post from the sidebar to view its content
      </p>
    </div>
  );
}