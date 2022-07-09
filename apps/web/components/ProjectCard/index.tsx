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

import { ProjectCard_project$key } from '../../__generated__/ProjectCard_project.graphql';

const ProjectFragment = graphql`
  fragment ProjectCard_project on Project {
    id
    name
    url
    renderedContent
    headerImageUrl
    createdAt
    tagsConnection(first: 5) {
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

export const BaseProjectCard = styled(Card)`
  position: relative;
  flex-direction: column;
  border-radius: ${(props) => props.theme.radii.default};
  box-shadow: ${(props) => props.theme.shadows.card};
  color: ${(props) => props.theme.colors.text};
  background-color: ${(props) => props.theme.colors.bgSecondary};
`;

const ProjectCardFooter = styled.div`
  display: flex;
  height: auto;
  flex-wrap: wrap;
  margin-left: 1rem;
  margin-right: 1rem;
  margin-bottom: 1rem;
`;

const ProjectName = styled(H3)``;

export type ProjectCardProps = { project: ProjectCard_project$key | null } & React.ComponentProps<
  typeof BaseProjectCard
>;
const ProjectCard = (props: ProjectCardProps) => {
  const { project: fullProject, ...rest } = props;
  const project = useFragment(ProjectFragment, fullProject);

  if (!project) {
    return <PlaceHolder />;
  }

  const { name, headerImageUrl, createdAt, renderedContent, tagsConnection, url } = project ?? {};
  const createDate = parseISO(createdAt);

  return (
    <BaseProjectCard {...rest}>
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
              <ProjectName mr="0.5rem">{name}</ProjectName>
            </Row>
            <MDXRemote {...JSON.parse(renderedContent)} components={MDXComponents} />
          </>
        )}
      </CardBody>
      <ProjectCardFooter>
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
      </ProjectCardFooter>
    </BaseProjectCard>
  );
};

export default ProjectCard;
