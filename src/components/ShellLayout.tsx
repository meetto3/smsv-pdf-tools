import type { ReactNode } from 'react';

type ShellLayoutProps = {
  topBar: ReactNode;
  leftPane: ReactNode;
  centerPane: ReactNode;
  rightPane: ReactNode;
  bottomBar: ReactNode;
};

export function ShellLayout({
  topBar,
  leftPane,
  centerPane,
  rightPane,
  bottomBar,
}: ShellLayoutProps) {
  return (
    <div className="app-shell">
      <header className="top-bar">{topBar}</header>

      <main className="workspace">
        <aside className="panel panel-left">{leftPane}</aside>
        <section className="panel panel-center">{centerPane}</section>
        <aside className="panel panel-right">{rightPane}</aside>
      </main>

      <footer className="bottom-bar">{bottomBar}</footer>
    </div>
  );
}
