'use client';
import Link from 'next/link';
import styles from './Modal.module.scss';

/**
 * A component that displays a modal.
 */
const Modal = ({
  children = '',
  topHexagon = false,
  topHexagonTop = '',
  topHexagonMiddle = '',
  topHexagonBottom = '',
  backArrow = false,
  redirectionLink = '',
  className = '',
}: {
  /** The content of the modal. */
  children?: React.ReactNode;
  /** Whether to display the top hexagon or not. */
  topHexagon?: boolean;
  /** The top text of the top hexagon. */
  topHexagonTop?: React.ReactNode;
  /** The middle text of the top hexagon. */
  topHexagonMiddle?: React.ReactNode;
  /** The bottom text of the top hexagon. */
  topHexagonBottom?: React.ReactNode;
  /** Whether to display the back arrow or not. */
  backArrow?: boolean;
  /** The redirection link for the back arrow. */
  redirectionLink?: string;
  /** An optional class name for the modal. */
  className?: string;
}) => (
  <div
    className={`z-10 flex justify-center items-center bg-white rounded-3xl relative drop-shadow-md ${styles.modal} ${className}`}>
    {topHexagon && (
      <div className="absolute flex flex-col items-center justify-center gap-4 rounded-lg -top-40">
        {/* SVG for the heptagon */}
        <svg
          className="h-80"
          xmlns="http://www.w3.org/2000/svg"
          width="269"
          height="261"
          viewBox="0 0 269 261"
          fill="none">
          <g filter="url(#filter0_d_2_6)">
            <path
              d="M130.263 50.9823C132.948 49.7261 136.052 49.7261 138.737 50.9823L198.521 78.9501C201.293 80.2468 203.319 82.7415 204.019 85.7206L218.676 148.102C219.388 151.135 218.647 154.327 216.67 156.735L175.465 206.927C173.566 209.241 170.73 210.582 167.736 210.582H101.264C98.2703 210.582 95.4342 209.241 93.5347 206.927L52.3301 156.735C50.3534 154.327 49.6118 151.135 50.3244 148.102L64.9814 85.7206C65.6814 82.7415 67.7069 80.2468 70.4789 78.9501L130.263 50.9823Z"
              fill="url(#paint0_linear_2_6)"
            />
          </g>
          <defs>
            <filter
              id="filter0_d_2_6"
              x="0.0591965"
              y="0.0401611"
              width="268.882"
              height="260.542"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset />
              <feGaussianBlur stdDeviation="25" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.54024 0 0 0 0 0.963281 0 0 0 0 0.341162 0 0 0 0.7 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2_6" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2_6" result="shape" />
            </filter>
            <linearGradient
              id="paint0_linear_2_6"
              x1="65.5"
              y1="79"
              x2="207.5"
              y2="193.5"
              gradientUnits="userSpaceOnUse">
              <stop stopColor="#8AF657" />
              <stop offset="1" stopColor="#47D981" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute flex flex-col items-center justify-center gap-3 mt-3 text-center text-white">
          <p className="text-sm tracking-[0.375rem] uppercase w-full mt-1">{topHexagonTop}</p>
          <h3 className="w-full text-5xl font-bold">{topHexagonMiddle}</h3>
          <p className="text-sm tracking-[0.375rem] uppercase w-full mb-1">{topHexagonBottom}</p>
        </div>
      </div>
    )}
    {backArrow && (
      <Link className="absolute flex items-center justify-center gap-2 top-8 left-8 text-main" href={redirectionLink}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Retour
      </Link>
    )}
    <div
      className={`flex items-center flex-col justify-center gap-12 text-main pb-8 ${
        topHexagon ? 'pt-32' : 'pt-8'
      } pl-8 pr-8`}>
      {children}
    </div>
  </div>
);

export default Modal;
