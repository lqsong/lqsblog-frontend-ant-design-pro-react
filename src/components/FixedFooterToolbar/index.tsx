import React from 'react';
import { RouteContext } from '@ant-design/pro-layout';
import classNames from 'classnames';
import styles from './index.less';

export interface FixedFooterToolbarProps {
    extra?: React.ReactNode;
    style?: React.CSSProperties;
    className?: string;
    isMobile?: boolean;
}

const FixedFooterToolbar: React.FC<FixedFooterToolbarProps> = (props) => {

    const { children, className, extra, ...restProps } = props;

    const getWidth = ({
        collapsed,
        isMobile,
        siderWidth,
      }: {
        collapsed?: boolean;
        isMobile?: boolean;
        siderWidth?: number;
      }) => {
        const sider = document.querySelector('.ant-layout-sider') as HTMLDivElement;
        if (!sider) {
          return undefined;
        }
        return isMobile ? undefined : `calc(100% - ${collapsed ? 80 : siderWidth || 256}px)`;
      };

    return (
        <RouteContext.Consumer>
            {(value) => (
          <div
            className={classNames(className, styles.toolbar)}
            style={{ width: getWidth(value), transition: '0.3s all' }}
            {...restProps}
          >
            <div className={styles.left}>{extra}</div>
            <div className={styles.right}>{children}</div>
          </div>
        )}
        </RouteContext.Consumer>
    );
}

export default FixedFooterToolbar;