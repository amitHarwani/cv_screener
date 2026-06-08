using {sap.capire.cvscreener as my} from '../db/schema';

@path: 'cv'
service CVService {
    entity Candidates as projection on my.Candidates;
}