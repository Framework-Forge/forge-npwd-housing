import React from 'react';

const HouseSvg = ({ size = 30 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M10 20V14H14V20H19V12H22L12 3L2 12H5V20H10Z"
      fill="#FFFFFF"
    />
  </svg>
);

export const HouseIcon = () => <HouseSvg size={30} />;
export const NotificationIcon = () => <HouseSvg size={24} />;

export default HouseIcon;
