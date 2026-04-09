import ArticleEditor from '../editor/ArticleEditor';

export const metadata = {
  title: 'Write New Article | Admin Dashboard',
};

export default function NewArticlePage() {
  return (
    <div className="py-8">
      <ArticleEditor />
    </div>
  );
}
