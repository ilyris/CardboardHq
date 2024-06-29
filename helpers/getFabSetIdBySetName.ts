import {CardSet} from "@/typings/FaBSet" ;
 
const getFabSetIdBySetName = (setName: string, setData: CardSet[]): string | undefined => {
    const foundSet = setData.find((set) => set.name === setName);
    return foundSet ? foundSet.id : undefined;
  };

export default getFabSetIdBySetName;
  