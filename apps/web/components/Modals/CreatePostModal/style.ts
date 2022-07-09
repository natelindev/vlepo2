import Image from 'next/image';

import styled from '@xstyled/styled-components';

export const HeaderImage = styled(Image)`
  object-fit: cover;
  width: 100%;
  filter: ${(props) => props.theme.colors.headerImageFilter};
`;
