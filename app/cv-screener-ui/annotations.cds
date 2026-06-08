using CVService as service from '../../srv/candidate_service';
annotate service.Candidates with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'Full Name',
                Value : FullName,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Email',
                Value : Email,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Phone',
                Value : Phone,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Years of Experience',
                Value : YearsOfExperience,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Current Role',
                Value : CurrentRole,
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneratedGroup',
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'FullName',
            Value : FullName,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Email',
            Value : Email,
        },
        {
            $Type : 'UI.DataField',
            Value : CurrentRole,
            Label : 'CurrentRole',
        },
        {
            $Type : 'UI.DataField',
            Label : 'YearsOfExperience',
            Value : YearsOfExperience,
        },
    ],
    UI.HeaderInfo : {
        Title : {
            $Type : 'UI.DataField',
            Value : FullName,
        },
        TypeName : '',
        TypeNamePlural : '',
    },
);

