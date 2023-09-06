import type { SVGAttributes } from "react";

export function Logo(props: SVGAttributes<SVGElement>) {
    return (
        <svg fill="currentColor" viewBox="0 0 160 86.6" {...props}>
            <polygon points="56.25 32.48 56.25 75.78 75 86.6 75 0 0 43.3 18.75 54.13 56.25 32.48"/>
            <polygon points="103.75 32.48 141.25 54.13 160 43.3 85 0 85 86.6 103.75 75.78 103.75 32.48"/>
        </svg>
    );
}
