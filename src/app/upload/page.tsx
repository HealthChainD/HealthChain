import UploadForm from '@/app/components/UploadForm';

import styles from './UploadPage.module.css';

export default function UploadPage() {
  return (
    <div className={styles.container}>      
      <div className={styles.content}>
        <h1 className={styles.title}>Upload Medical Data</h1>
        <UploadForm />
      </div>
    </div>
  );
}