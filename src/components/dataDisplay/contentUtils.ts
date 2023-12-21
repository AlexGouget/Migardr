export const renderItemAge = (item:{dyear: number, dmounth: number, dday: number, dyearAfter: number, dmonthAfter: number, ddayAfter: number}) => {
    let itemYear = ''
    const {dyear, dmounth, dday, dyearAfter, dmonthAfter, ddayAfter} = item;
    const itemYearBefore =  dyear ? `${dyear < 0 ? dyear*(-1) : dyear} ${dyear < 0 ? '(BC)' : '(AC)'}` : 'unknow';

    const itemYearAfter = dyearAfter ? `${dyearAfter < 0 ? dyearAfter*(-1) : dyearAfter} ${dyearAfter < 0 ? '(BC)' : '(AC)'}` : '';

    const itemAge = itemYearBefore + (itemYearAfter ? ` - ${itemYearAfter}` : '');

    return itemAge
}