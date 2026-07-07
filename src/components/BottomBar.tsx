type BottomBarProps = {
  activeFileName?: string;
  activePages?: number | null;
};

export function BottomBar({ activeFileName, activePages }: BottomBarProps) {
  return (
    <div className="bottom-bar-inner">
      <div>
        <strong>進捗</strong>
        <p>
          {activeFileName ?? '未読込'}{' '}
          {activePages ? `${activePages}ページ` : 'ページ数未解析'}。端末内処理モードです。
        </p>
      </div>
      <div className="bottom-bar-actions">
        <button className="ghost-button" type="button">
          ルール保存
        </button>
        <button className="primary-button" type="button">
          出力設定へ
        </button>
      </div>
    </div>
  );
}
