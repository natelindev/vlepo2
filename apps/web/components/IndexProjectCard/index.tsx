import { graphql, useFragment } from 'relay-hooks';
import { CardBody, CardImage, Row } from 'ui';

import { HeightProps, WidthProps } from '@xstyled/system';

import { IndexProjectCard_project$key } from '../../__generated__/IndexProjectCard_project.graphql';
import { Abstract, BaseProjectCard, IndexImageOverlay, ProjectCardTitle } from './style';

export type ArticleCardProps = {
  project: IndexProjectCard_project$key;
} & WidthProps &
  HeightProps &
  React.ComponentProps<typeof BaseProjectCard>;

const indexProjectCardFragment = graphql`
  fragment IndexProjectCard_project on Project {
    name
    url
    abstract
    headerImageUrl
  }
`;

const IndexProjectCard = (props: ArticleCardProps) => {
  const { project: fullProject, h, w, ...rest } = props;
  const project = useFragment(indexProjectCardFragment, fullProject);
  const { name, headerImageUrl, url, abstract } = project;

  return (
    <BaseProjectCard
      external
      minHeight={h}
      minWidth={w}
      maxHeight={h}
      maxWidth={w}
      w={w}
      h={h}
      {...rest}
      color={headerImageUrl ? 'whiteText' : 'text'}
      ariaLabel={name}
      href={`${url}`}
    >
      {headerImageUrl && (
        <CardImage
          layout="responsive"
          height={200}
          width={200}
          objectFit="cover"
          src={headerImageUrl}
          alt={name}
        />
      )}

      <IndexImageOverlay textShadow={headerImageUrl ? 'rgba(0,0,0, 0.3) 0 0 8px' : 'none'}>
        <CardBody>
          {name && (
            <Row>
              <ProjectCardTitle>{name}</ProjectCardTitle>
            </Row>
          )}
          {abstract && <Abstract>{abstract}</Abstract>}
        </CardBody>
      </IndexImageOverlay>
    </BaseProjectCard>
  );
};

export default IndexProjectCard;
