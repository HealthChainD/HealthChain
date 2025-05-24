import DecryptForm from '@/app/components/DecryptForm/DecryptForm';

import styles from './DecryptPage.module.css';

export default function DecryptPage() {
  return (
    <div className={styles.container}>      
      <div className={styles.content}>
        <DecryptForm />
      </div>
    </div>
  );
}
