import styled from 'styled-components';
// Style Component//

const HeadingBig = styled.h1`
  color: ${props => props.theme.headingColor};
  font-size: 50px;
  font-weight: 600;
  font-family: 'Bai Jamjuree', sans-serif;
`;
const HeadingLarge = styled.h2`
  color: ${props => props.theme.headingColor};
  font-size: 18px;
  font-weight: 600;
  text-transform: uppercase;
  font-family: 'Bai Jamjuree', sans-serif;
`;
const HeadingMedium = styled.h3`
  color: ${props => props.theme.headingColor};
  font-size: 16px;
`;
const HeadingSmall = styled.h2`
  color: ${props => props.theme.boxTitleColor};
  font-size: 16px;
  margin-bottom: 10px;
`;
const TextValue = styled.div`
  font-family: 'Bai Jamjuree', sans-serif;
  font-size: 18px;
  color: ${props => props.theme.boxValueColor};
`
const TextAddressValue = styled(TextValue)`
  cursor: pointer;
  color: ${props => props.theme.boxAddressValueColor};
`
const NoticeTextRed = styled.span`
  color: #be445e;
`;
const TextLinkBlue = styled.a`
  color: ${props => props.theme.highlightColor};
`;
const TextBlue = styled.span`
  color: ${props => props.theme.highlightColor};
  cursor: ${props => props.cursor || 'auto'};
  transition: all 0.3s;
  &:hover {
    color: ${props => props.theme.highlightHoverColor};
  }
`;
const TextYellow = styled.span`
  color: ${props => props.theme.highlightColor2};
`;
const TextLinkYellow = styled.a`
  color: ${props => props.theme.highlightColor2} !important;
  cursor: pointer;
`;
const TextYellowPointer = styled.span`
  color: ${props => props.theme.highlightColor2};
  font-size: 20px;
  cursor: pointer;
  transition: all 0.3s;
  &:hover {
    color: ${props => props.theme.highlightHoverColor2};
  }
`;
const TextGray = styled.div`
  color: ${props => props.theme.highlightColor1};
`;
const BoxText = styled.div``;
export {
  HeadingBig,
  HeadingLarge,
  HeadingMedium,
  HeadingSmall,
  NoticeTextRed,
  TextLinkBlue,
  TextBlue,
  TextYellow,
  TextLinkYellow,
  TextYellowPointer,
  BoxText,
  TextGray,
  TextValue,
  TextAddressValue,
};
