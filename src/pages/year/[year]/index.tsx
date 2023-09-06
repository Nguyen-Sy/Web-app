import Link from "next/link";
import { AnimeSummaryCard } from "components/card";
import { Button } from "components/button";
import { Column, Row } from "components/box";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "components/icon";
import { Text } from "components/text";
import { fetchData } from "lib/server";
import { SEO } from "components/seo";
import gql from "graphql-tag";
import { ANIME_A_Z, getComparator } from "utils/comparators";
import fetchStaticPaths from "utils/fetchStaticPaths";
import type { SharedPageProps } from "utils/getSharedPageProps";
import getSharedPageProps from "utils/getSharedPageProps";
import type { ParsedUrlQuery } from "querystring";
import type { GetStaticPaths, GetStaticProps } from "next";
import type { YearDetailPageAllQuery, YearDetailPageQuery, YearDetailPageQueryVariables } from "generated/graphql";
import type { RequiredNonNullable } from "utils/types";

const seasonOrder = [ "Winter", "Spring", "Summer", "Fall" ];

export interface YearDetailPageProps extends SharedPageProps, RequiredNonNullable<YearDetailPageQuery> {}

interface YearDetailPageParams extends ParsedUrlQuery {
    year: string
}

export default function YearDetailPage({ year }: YearDetailPageProps) {
    return (
        <>
            <SEO title={String(year.value)}/>
            {year.seasons.map((season) => (
                <SeasonPreview key={season.value} season={season.value} year={year.value} animeList={season.anime}/>
            ))}
        </>
    );
}

interface SeasonPreviewProps {
    season: string
    year: number
    animeList: YearDetailPageProps["year"]["seasons"][number]["anime"]
}

function SeasonPreview({ season, year, animeList }: SeasonPreviewProps) {
    return <>
        <Text variant="h2">{season}</Text>
        <Column style={{ "--gap": "16px" }}>
            {animeList.map((anime) => (
                <AnimeSummaryCard key={anime.slug} anime={anime} expandable/>
            ))}
        </Column>
        <Row style={{ "--justify-content": "center" }}>
            <Button href={`/year/${year}/${season.toLowerCase()}`} as={Link} variant="silent" isCircle>
                <Icon icon={faChevronDown}/>
            </Button>
        </Row>
    </>;
}

export const getStaticProps: GetStaticProps<YearDetailPageProps, YearDetailPageParams> = async ({ params }) => {
    const { data, apiRequests } = await fetchData<YearDetailPageQuery, YearDetailPageQueryVariables>(gql`
        ${AnimeSummaryCard.fragments.anime}
        ${AnimeSummaryCard.fragments.expandable}

        query YearDetailPage($year: Int!) {
            year(value: $year) {
                value
                seasons {
                    value
                    anime {
                        slug
                        ...AnimeSummaryCardAnime
                        ...AnimeSummaryCardAnimeExpandable
                    }
                }
            }
            yearAll {
                value
            }
        }
    `, params && {
        year: +params.year
    });

    if (!data.year) {
        return {
            notFound: true
        };
    }

    data.year.seasons.sort((a, b) => seasonOrder.indexOf(a.value) - seasonOrder.indexOf(b.value));
    data.yearAll.sort((a, b) => a.value- b.value);

    for (const season of data.year.seasons) {
        season.anime = season.anime
            .filter((anime) => anime.name)
            .sort(getComparator(ANIME_A_Z))
            .slice(0, 3);
    }

    return {
        props: {
            ...getSharedPageProps(apiRequests),
            year: data.year,
            yearAll: data.yearAll,
        },
        // Revalidate after 3 hours (= 10800 seconds).
        revalidate: 10800
    };
};

export const getStaticPaths: GetStaticPaths<YearDetailPageParams> = () => {
    return fetchStaticPaths(async () => {
        const { data } = await fetchData<YearDetailPageAllQuery>(gql`
            query YearDetailPageAll {
                yearAll {
                    value
                }
            }
        `);

        return data.yearAll.map((year) => ({
            params: {
                year: String(year.value)
            }
        }));
    });
};
