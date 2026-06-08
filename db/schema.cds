using {
    managed,
    cuid
} from '@sap/cds/common';
namespace sap.capire.cvscreener;
@odata.draft.bypass
@odata.draft.enabled
entity Candidates : managed, cuid {
    FullName          : String;
    Email             : String;
    Phone             : String;
    Skills            : String;
    YearsOfExperience : Integer;
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
