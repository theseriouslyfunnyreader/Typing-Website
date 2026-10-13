export interface LessonData {
  id: number;
  label: string;
  iconType: 'box' | 'searchbox' | 'timer' | 'character' | 'keyboard';
  letters?: string;
  stars: number;
  completed: boolean;
  hasBadge: boolean;
  text: string;
}

export const lessonsData: LessonData[] = Array.from({ length: 24 }, (_, i) => {
  const id = i + 1;
  let iconType: LessonData['iconType'] = 'box';
  let letters = '';
  let label = '';
  let text = 'The quick brown fox jumps over the lazy dog. Practice makes perfect.';

  if ([7, 11, 14, 20, 21].includes(id)) iconType = 'timer';
  else if ([8, 15, 22].includes(id)) iconType = 'character';
  else if ([16, 17].includes(id)) iconType = 'keyboard';
  
  if (iconType === 'box') {
    if (id === 1) { 
      label = 'Introduction'; 
      text = 'ffff jjjj ff jj fff jjj fj fj jjf ffj fff jjj ffj jjf fjfj fffj jjjf ffjj ff jj ffff '.repeat(2).trim();
    }
    else if (id === 2 || id === 3) { 
      letters = 'fj'; 
      label = id === 2 ? 'Keys: f & j' : 'Spacebar'; 
      text = (id === 2 ? 'f j f j ff jj f f j j fj jf fj jf fjj jff f j ' : 'f j ff jj f j f j ff jj f j ').repeat(2).trim();
    }
    else if (id === 4) { 
      letters = 'fj'; 
      label = 'Review: f & j'; 
      iconType = 'searchbox'; 
      text = 'fj jf ff jj fjf jfj fff jjj fj jf '.repeat(3).trim();
    }
    else if (id === 5 || id === 6) { 
      letters = 'dk'; 
      label = id === 5 ? 'Keys: d & k' : 'Review: d & k'; 
      iconType = id === 6 ? 'searchbox' : 'box'; 
      text = (id === 5 ? 'dd kk dd kk d k d k dkd kdk d d k k ' : 'dk kd dd kk d k d k dk kd dkd kdk ').repeat(2).trim();
    }
    else if (id === 9 || id === 10) { 
      letters = 'sl'; 
      label = id === 9 ? 'Keys: s & l' : 'Review: s & l'; 
      iconType = id === 10 ? 'searchbox' : 'box'; 
      text = (id === 9 ? 'ss ll ss ll s l s l sls lsl s s l l ' : 'sl ls ss ll s l s l sl ls sls lsl ').repeat(2).trim();
    }
    else if (id === 12 || id === 13) { 
      letters = 'a;'; 
      label = id === 12 ? 'Keys: a & ;' : 'Review: a & ;'; 
      iconType = id === 13 ? 'searchbox' : 'box'; 
      text = (id === 12 ? 'aa ;; aa ;; a ; a ; a;a ;a; a a ; ; ' : 'a; ;a aa ;; a ; a ; a; ;a a;a ;a; ').repeat(2).trim();
    }
    else if (id === 18 || id === 19) { 
      letters = 'gh'; 
      label = id === 18 ? 'Keys: g & h' : 'Review: g & h'; 
      iconType = id === 19 ? 'searchbox' : 'box'; 
      text = (id === 18 ? 'gg hh gg hh g h g h ghg hgh g g h h ' : 'gh hg gg hh g h g h gh hg ghg hgh ').repeat(2).trim();
    }
    else if (id === 23 || id === 24) { 
      letters = 'ei'; 
      label = id === 23 ? 'Keys: e & i' : 'Review: e & i'; 
      iconType = id === 24 ? 'searchbox' : 'box'; 
      text = (id === 23 ? 'ee ii ee ii e i e i eie iei e e i i ' : 'ei ie ee ii e i e i ei ie eie iei ').repeat(2).trim();
    }
  } else if (iconType === 'timer') {
    if (id === 7) { label = 'Practice: d & k'; text = 'df jk fd kj ddf jjk kjd fdk '.repeat(3).trim(); }
    if (id === 11) { label = 'Practice: s & l'; text = 'dsf jkl fds lkj sld skd fld '.repeat(3).trim(); }
    if (id === 14) { label = 'First 8 Keys'; text = 'asdf jkl; fdsa ;lkj asdf jkl; '.repeat(3).trim(); }
    if (id === 20) { label = 'Practice: g & h'; text = 'fg jh gf hj dgf kjh sgf ljh '.repeat(3).trim(); }
    if (id === 21) { label = 'Review'; text = 'asdfg hjkl; fdsa ;lkj gfds hjkl '.repeat(3).trim(); }
  } else if (iconType === 'character') {
    if (id === 8) { label = 'Game: fjkd'; text = 'fjkd dfkj kfjd jdfk fdjk jkfd '.repeat(3).trim(); }
    if (id === 15) { label = 'Game: 8 Keys'; text = 'asdf jkl; fdsa ;lkj asdf jkl; '.repeat(3).trim(); }
    if (id === 22) { label = 'Home Row'; text = 'asdfghjkl; asdfghjkl; asdfghjkl; '.repeat(3).trim(); }
  } else if (iconType === 'keyboard') {
    if (id === 16) { label = 'Left Hand 1'; text = 'asdf asdf asdf fdsa fdsa fdsa '.repeat(3).trim(); }
    if (id === 17) { label = 'Right Hand 1'; text = 'jkl; jkl; jkl; ;lkj ;lkj ;lkj '.repeat(3).trim(); }
  }

  const stars = id <= 24 ? 5 : 0;
  const completed = id <= 24;

  return {
    id,
    label,
    iconType,
    letters,
    stars,
    completed,
    hasBadge: [4, 6, 7, 8, 10, 11, 13, 14, 15, 16, 17, 19, 20, 21, 24].includes(id),
    text
  };
});
