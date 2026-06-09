using {
    managed,
    cuid
} from '@sap/cds/common';
namespace sap.capire.cvscreener;
@odata.draft.bypass
@odata.draft.enabled
entity Candidates : managed, cuid {
    @mandatory
    FullName          : String;
    @mandatory
    @assert.format: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    @assert.format.message: 'Please enter a valid email address'
    Email             : String;
    @mandatory
    @assert.format: '^\+?[0-9]\d{1,14}$'
    @assert.format.message: 'Please enter a valid phone number without any spaces in between'
    Phone             : String;
    Skills            : String;
    @mandatory
    YearsOfExperience : Integer;
    @mandatory
    CurrentRole       : String;
    CVText            : LargeString;
    AISummary         : LargeString;
    FileName          : String;

    @Core.MediaType: FileType
    @Core.ContentDisposition.Filename: FileName
    Content: LargeBinary;
    
    @Core.IsMediaType: true
    FileType: String;
}
