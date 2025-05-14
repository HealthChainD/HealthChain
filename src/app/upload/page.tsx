import UploadForm from '@/app/components/UploadForm';

export default function UploadPage() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Завантажити медичні дані</h1>
      <UploadForm />
    </div>
  );
}
