import Buttons from '../../components/Buttons';
import { useEffect, useState } from 'react';
import { COLOR_OPTION } from './constant.js';
import { getBackgroundImageURL } from '../../api/getBackgroundImageURL.js';
import { createRollingPaper } from '../../api/createRollingPaper.js';
import { useNavigate } from 'react-router-dom';
import * as S from './PostStyled';
import CheckMark from './components/CheckMark';
import ToggleButton from '../../components/Buttons/ToggleButton/ToggleButton.jsx';

const Post = () => {
  const [selectBackgroundType, setSelectBackgroundType] = useState({
    color: 0,
    image: 0,
  });
  const [backgroundImgData, setBackgroundImgData] = useState();
  const [inputValue, setInputValue] = useState();
  const [isEmptyError, setIsEmptyError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [backgroundType, setBackgroundType] = useState('color');
  const navigate = useNavigate();

  const handleLoadBackgroundImgURL = async () => {
    try {
      const data = await getBackgroundImageURL();
      setBackgroundImgData(data.imageUrls);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectBackground = (e) => {
    e.preventDefault();
    setSelectBackgroundType({
      ...selectBackgroundType,
      [backgroundType]: +e.target.id,
    });
  };

  const handleInputValue = (e) => {
    setInputValue(e.target.value);
  };

  const handleOnBlur = (e) => {
    const currentInput = e.target.value;
    setIsEmptyError(!currentInput ? true : false);
  };

  const handleBackgroundType = (e) => {
    setBackgroundType(e.target.name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsEmptyError(!inputValue ? true : false);

    const { image, color } = selectBackgroundType;

    const body = {
      team: '10',
      name: inputValue,
      backgroundColor: COLOR_OPTION[color],
      backgroundImageURL: backgroundType === 'image' ? backgroundImgData[image] : null,
    };
    try {
      setIsLoading(true);
      const { id } = await createRollingPaper(body);
      navigate(`/post/${id}`);
    } catch (error) {
      return;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleLoadBackgroundImgURL();
  }, []);

  return (
    <S.PostLayout onSubmit={handleSubmit}>
      <S.SendToInputContainer>
        <S.MainDescription>To.</S.MainDescription>
        <S.InputBox
          type="text"
          placeholder="받는 사람 이름을 입력해 주세요"
          value={inputValue}
          onChange={handleInputValue}
          onBlur={handleOnBlur}
        />
        <S.ErrorMessage isEmptyError={isEmptyError}>값을 입력해 주세요.</S.ErrorMessage>
      </S.SendToInputContainer>
      <div>
        <S.MainDescription>배경화면을 선택해 주세요.</S.MainDescription>
        <S.Subscription>컬러를 선택하거나, 이미지를 선택할 수 있습니다.</S.Subscription>
      </div>
      <ToggleButton
        isBgType={backgroundType}
        leftType="color"
        rightType="image"
        leftContent="컬러"
        rightContent="이미지"
        onClick={handleBackgroundType}
      />
      <S.BoxContainer>
        {backgroundType === 'color'
          ? COLOR_OPTION.map((color, index) => (
              <S.BackgroundColor backgroundColor={color} key={index} id={index} onClick={handleSelectBackground}>
                {index === selectBackgroundType.color && <CheckMark />}
              </S.BackgroundColor>
            ))
          : backgroundImgData.map((url, index) => (
              <S.BackgroundImage backgroundImageURL={url} key={index} id={index} onClick={handleSelectBackground}>
                {index === selectBackgroundType.image && (
                  <>
                    <CheckMark />
                    <S.SelectImageCover />
                  </>
                )}
              </S.BackgroundImage>
            ))}
      </S.BoxContainer>
      <Buttons buttonType="Primary56" buttonSize="large" isDisabled={isEmptyError || isLoading} onClick={handleSubmit}>
        생성하기
      </Buttons>
    </S.PostLayout>
  );
};

export default Post;
