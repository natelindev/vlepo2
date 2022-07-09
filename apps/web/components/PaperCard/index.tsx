import { addDays, compareAsc, parseISO } from 'date-fns';
import { MDXRemote } from 'next-mdx-remote';
import { useFragment } from 'relay-hooks';
import { graphql } from 'relay-runtime';
import {
  Badge,
  Card,
  CardBody,
  H3,
  Image,
  MDXComponents,
  PlaceHolder,
  Row,
  SocialButton,
  Tag,
} from 'ui';

import styled from '@xstyled/styled-components';

import { PaperCard_paper$key } from '../../__generated__/PaperCard_paper.graphql';

const PaperFragment = graphql`
  fragment PaperCard_paper on Paper {
    id
    name
    url
    renderedContent
    headerImageUrl
    createdAt
    tagsConnection {
      edges {
        node {
          id
          name
          mainColor
          secondaryColor
        }
      }
    }
  }
`;

export const BasePaperCard = styled(Card)`
  position: relative;
  flex-direction: column;
  border-radius: ${(props) => props.theme.radii.default};
  box-shadow: ${(props) => props.theme.shadows.card};
  color: ${(props) => props.theme.colors.text};
  background-color: ${(props) => props.theme.colors.bgSecondary};
`;

const PaperCardFooter = styled.div`
  display: flex;
  height: auto;
  flex-wrap: wrap;
  margin-left: 1rem;
  margin-right: 1rem;
  margin-bottom: 1rem;
`;

const PaperName = styled(H3)``;

export type PaperCardProps = { paper: PaperCard_paper$key | null } & React.ComponentProps<
  typeof BasePaperCard
>;
const PaperCard = (props: PaperCardProps) => {
  const { paper: fullPaper, ...rest } = props;
  const paper = useFragment(PaperFragment, fullPaper);

  if (!paper) {
    return <PlaceHolder />;
  }

  const { name, headerImageUrl, createdAt, renderedContent, tagsConnection, url } = paper ?? {};
  const createDate = parseISO(createdAt);

  return (
    <BasePaperCard {...rest}>
      {compareAsc(new Date(), addDays(createDate, 1)) === -1 && (
        <Row h="0">
          <Badge h="1.2rem" variant="accent" mt="-0.5rem" ml="auto" mr="-0.5rem">
            new
          </Badge>
        </Row>
      )}
      {headerImageUrl && (
        <Image
          variant="top"
          height="15rem"
          width="100%"
          objectFit="cover"
          src={headerImageUrl}
          alt={name}
        />
      )}
      <CardBody>
        {name && (
          <>
            <Row>
              <PaperName mr="0.5rem">{name}</PaperName>
            </Row>
            <MDXRemote {...JSON.parse(renderedContent)} components={MDXComponents} />
          </>
        )}
      </CardBody>
      <PaperCardFooter>
        {tagsConnection.edges.map((t) => (
          <Tag
            mainColor={t.node.mainColor}
            secondaryColor={t.node.secondaryColor}
            name={t.node.name}
            key={t.node.id}
            href={`/tags/${t.node.name}`}
          />
        ))}
        {url && <SocialButton ml="auto" variant="github" href={url} />}
      </PaperCardFooter>
    </BasePaperCard>
  );
};

export default PaperCard;
