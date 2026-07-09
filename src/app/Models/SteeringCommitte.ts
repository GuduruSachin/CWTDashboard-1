export interface SteeringCommitte {
    code : number;
    message : string;
    RegionCountry : RegionCountry[];
    Owner : Owner[];
    Data : KB_Data[];
}
export interface RegionCountry {
    Region : string;
    Country : string;
}
export interface Owner {
    Owner : string;
    isSelected : boolean;
}
export interface SC_Region {
    Region : string;
}
export interface SC_Country {
    Country : string;
}
export interface SC_StandardKeyDeliverables {
    KeyDeliverable : string;
}
export interface KB_Data {
    Name : string;
    Link : string;
    Comments : string;
    Keywords : string;
    Source : string;
    Type : string;
}