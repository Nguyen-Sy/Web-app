import { faFilm } from "@fortawesome/free-solid-svg-icons";
import { Tag } from "components/tag/Tag";
import gql from "graphql-tag";
import type { EpisodeTagEntryFragment } from "generated/graphql";

interface EpisodeTagProps {
    entry: EpisodeTagEntryFragment
}

export function EpisodeTag({ entry }: EpisodeTagProps) {
    return (
        <Tag icon={faFilm}>
            {entry.episodes || "—"}
        </Tag>
    );
}

EpisodeTag.fragments = {
    entry: gql`
        fragment EpisodeTagEntry on Entry {
            episodes
        }
    `,
};
