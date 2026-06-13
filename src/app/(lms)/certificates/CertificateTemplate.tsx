// src/app/(lms)/certificates/CertificateTemplate.tsx
import styles from "./template.module.css";

type Props = {
  studentName: string;
  courseTitle: string;
  certificateNumber: string;
  completionDate: string;
};

export default function CertificateTemplate({
  studentName,
  courseTitle,
  certificateNumber,
  completionDate,
}: Props) {
  return (
    <div className={styles.sheet}>
      <img
        src="/certificate-template.png"
        alt="Certificate"
        className={styles.background}
      />

      <div className={styles.studentName}>
        {studentName}
      </div>

      <div className={styles.courseTitle}>
        {courseTitle}
      </div>

      <div className={styles.certificateId}>
        {certificateNumber}
      </div>

      <div className={styles.completionDate}>
        {completionDate}
      </div>
    </div>
  );
}