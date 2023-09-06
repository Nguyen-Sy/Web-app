import {
    faLinkSlash,
    faForward,
    faComments,
    faCompactDisc,
    faEye
} from "@fortawesome/free-solid-svg-icons";
import { Tag } from "components/tag/Tag";
import { Row } from "components/box";
import styled from "styled-components";
import gql from "graphql-tag";
import type { VideoTagsVideoFragment } from "generated/graphql";

const StyledVideoTags = styled(Row)`
    align-items: baseline;
    flex-wrap: wrap;
    gap: 8px;
`;

interface VideoTagsProps {
    video: VideoTagsVideoFragment
    hideTextOnMobile?: boolean
}

export function VideoTags({ video, hideTextOnMobile = false }: VideoTagsProps) {
    return (
        <StyledVideoTags>
            <Tag title="Resolution">
                {video.resolution}p
            </Tag>

            {video.nc && (
                <Tag icon={faLinkSlash} title="No Credits"/>
            )}

            {video.subbed && (
                <Tag icon={faComments} title="With Subtitles"/>
            )}

            {video.lyrics && (
                <Tag icon={faComments} title="With Lyrics"/>
            )}

            {video.uncen && (
                <Tag icon={faEye} title="Uncensored"/>
            )}

            {!!video.source && (
                <Tag icon={faCompactDisc} title="Source">
                    {video.source.toUpperCase()}
                </Tag>
            )}

            {video.overlap !== "NONE" && (
                <Tag icon={faForward} title="Overlap" hideTextOnMobile={hideTextOnMobile}>
                    {video.overlap.toUpperCase().replace("TRANSITION", "TRANS")}
                </Tag>
            )}
        </StyledVideoTags>
    );
}

VideoTags.fragments = {
    video: gql`
        fragment VideoTagsVideo on Video {
            resolution
            nc
            subbed
            lyrics
            uncen
            source
            overlap
        }
    `
};
