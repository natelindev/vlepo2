import { graphql, useFragment } from 'relay-hooks';
import { CardBody, CardImage, Row } from 'ui';

import { HeightProps, WidthProps } from '@xstyled/system';

import { IndexPaperCard_paper$key } from '../../__generated__/IndexPaperCard_paper.graphql';
import { Abstract, BasePaperCard, IndexImageOverlay, PaperCardTitle } from './style';

export type ArticleCardProps = {
  paper: IndexPaperCard_paper$key;
} & WidthProps &
  HeightProps &
  React.ComponentProps<typeof BasePaperCard>;

const indexPaperCardFragment = graphql`
  fragment IndexPaperCard_paper on Paper {
    name
    url
    abstract
    headerImageUrl
  }
`;

const IndexPaperCard = (props: ArticleCardProps) => {
  const { paper: fullPaper, h, w, ...rest } = props;
  const paper = useFragment(indexPaperCardFragment, fullPaper);
  const { name, headerImageUrl, url, abstract } = paper;

  return (
    <BasePaperCard
      external
      {...rest}
      minHeight={h}
      minWidth={w}
      maxHeight={h}
      maxWidth={w}
      w={w}
      h={h}
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
              <PaperCardTitle>{name}</PaperCardTitle>
            </Row>
          )}
          {abstract && <Abstract>{abstract}</Abstract>}
        </CardBody>
      </IndexImageOverlay>
    </BasePaperCard>
  );
};

export default IndexPaperCard;
