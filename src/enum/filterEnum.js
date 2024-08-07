export const DISPLAY_ENUM = {
  SIDE: 'oneSide',
  FULL: 'fullLine',
}

export const filterParams = [
  {
    zh: '左侧内囊前肢',
    en: 'Left ALIC',
    displayName: '左侧内囊前肢（ALIC）',
    searchName: 'Left-ALIC',
    side: DISPLAY_ENUM.SIDE,
  },
  {
    zh: '右侧内囊前肢',
    en: 'Right ALIC',
    displayName: '右侧内囊前肢（ALIC）',
    searchName: 'Right-ALIC',
    side: DISPLAY_ENUM.SIDE,
  },
  {
    zh: '左侧尾状核',
    en: 'Left Ca',
    displayName: '左侧尾状核（Ca）',
    searchName: 'Left-Caudate',
    side: DISPLAY_ENUM.SIDE,
  },
  {
    zh: '右侧尾状核',
    en: 'Right Ca',
    displayName: '右侧尾状核（Ca）',
    searchName: 'Right-Caudate',
    side: DISPLAY_ENUM.SIDE,
  },
  {
    zh: '左侧豆状核',
    en: 'Left Lenticula',
    displayName: '左侧豆状核（Lenticula）',
    searchName: 'Left-Lenticula',
    side: DISPLAY_ENUM.SIDE,
  },
  {
    zh: '右侧豆状核',
    en: 'Right Lenticula',
    displayName: '右侧豆状核（Lenticula）',
    searchName: 'Right-Lenticula',
    side: DISPLAY_ENUM.SIDE,
  },
  {
    zh: '左侧伏隔核',
    en: 'Left NAc',
    displayName: '左侧伏隔核（NAc）',
    searchName: 'Left-NAc',
    side: DISPLAY_ENUM.SIDE,
  },
  {
    zh: '右侧伏隔核',
    en: 'Right NAc',
    displayName: '右侧伏隔核（NAc）',
    searchName: 'Right-NAc',
    side: DISPLAY_ENUM.SIDE,
  },
  {
    zh: '左侧海马',
    en: 'Left Hippo',
    displayName: '左侧海马（Hippo）',
    searchName: 'Left-Hippocampus',
    side: DISPLAY_ENUM.SIDE,
  },
  {
    zh: '右侧海马',
    en: 'Right Hippo',
    displayName: '右侧海马（Hippo）',
    searchName: 'Right-Hippocampus',
    side: DISPLAY_ENUM.SIDE,
  },
  {
    zh: '左侧杏仁核',
    en: 'Left Amg',
    displayName: '左侧杏仁核（Amg）',
    searchName: 'Left-Amygdala',
    side: DISPLAY_ENUM.SIDE,
  },
  {
    zh: '右侧杏仁核',
    en: 'Right Amg',
    displayName: '右侧杏仁核（Amg）',
    searchName: 'Right-Amygdala',
    side: DISPLAY_ENUM.SIDE,
  },
  {
    zh: '左侧丘脑',
    en: 'Left Thalamus',
    displayName: '左侧丘脑（Thalamus）',
    searchName: 'Left-Thalamus',
    side: DISPLAY_ENUM.SIDE,
  },
  {
    zh: '右侧丘脑',
    en: 'Right Thalamus',
    displayName: '右侧丘脑（Thalamus）',
    searchName: 'Right-Thalamus',
    side: DISPLAY_ENUM.SIDE,
  },
]

export const generateNucleusCheckList = () => {
  const newFilter = filterParams.map((v, i) => {
    return {
      // 排序的依据
      index: i,
      // 判断filter里是否有这个核团或电极触点，存在才可以进行追踪
      exist: false,
      ...v,
    }
  })
  return newFilter
}
