import { parse } from "../parse/parse";
import { checkForBusinessRules } from "./checkForBusinessRules";

test("check for business rules", () => {
  const dcc =
    "HC1:NCF8%ASJOQP2J40$FED%OMCD*LOPEI6TQ6/IN7S:S7P%8J1QQT6%WNT%PXHKMIS0ETVHJWRV CSWJR6T9QN0BG10QE-4PFT7-3G68S-/C.D2Z8CA1A08L 1L7-B24H91859PH:QSW3-8L36CNFT2ZM1 MR6EQZMF.L.7WN0OFLF:EWW3M3SD971Y2UT5OZOHJ1P2E9LF80IO948AO0.DHYNKKTJ$:J$PPE5W4ZD8CT5IAT-KGV12O2FF4+NJ4QGBV9QGU%FAYCQWH6QTV:*D.:4-$74FBZEN4+EJZGPLVJ2D6S8 S4AFIF54N/7%FJ21FEYKMEU2-9X5J1J1G7L*+9N-0H6CZI3J1J $5/56.J41WCI88:NA00M8.BTJBMOM/A9872TZUAA0WLK%007INON1V6DX30RAH0LBP%5X.AU71GCRVWSFM6W5S3/6M-4AHFS4AAH4X3TI-4.I6$G1:NQJMQIVFJRI4 2MOU1OMJMTZSB5UHZSHL*S2KJK*4QN1IRGR48$K3981J:A+BW6DF1:ETDTYWLH3775R8:3:TVS4N :RGIE%/M+6EMMBC6HH6K%324YVUWEPK0E1KR.75-R1/B-$U::OWJSI6JS6GQ:GPN7K*UECD4GV8P3N8J";

  const rules = [
    {
      "Identifier": "VR-DE-0001",
      "Type": "Acceptance",
      "Country": "DE",
      "Version": "1.0.0",
      "SchemaVersion": "1.0.0",
      "Engine": "CERTLOGIC",
      "EngineVersion": "0.7.5",
      "CertificateType": "Vaccination",
      "Description": [
        {
          "lang": "en",
          "desc": "The vaccination schedule must be complete (e.g., 1/1, 2/2)."
        }
      ],
      "ValidFrom": "2021-07-03T00:00:00Z",
      "ValidTo": "2030-06-01T00:00:00Z",
      "AffectedFields": [
        "v.0",
        "v.0.dn",
        "v.0.sd"
      ],
      "Logic": {
        "if": [
          {
            "var": "payload.v.0"
          },
          {
            ">=": [
              {
                "var": "payload.v.0.dn"
              },
              {
                "var": "payload.v.0.sd"
              }
            ]
          },
          true
        ]
      }
    },
    {
      "Identifier": "VR-DE-0002",
      "Type": "Acceptance",
      "Country": "DE",
      "Version": "1.0.0",
      "SchemaVersion": "1.0.0",
      "Engine": "CERTLOGIC",
      "EngineVersion": "0.7.5",
      "CertificateType": "Vaccination",
      "Description": [
        {
          "lang": "en",
          "desc": "Only vaccines in the allowed valueset that have been approved by the EMA are allowed."
        }
      ],
      "ValidFrom": "2021-07-03T00:00:00Z",
      "ValidTo": "2030-06-01T00:00:00Z",
      "AffectedFields": [
        "v.0",
        "v.0.mp"
      ],
      "Logic": {
        "if": [
          {
            "var": "payload.v.0"
          },
          {
            "in": [
              {
                "var": "payload.v.0.mp"
              },
              [
                "EU/1/20/1528",
                "EU/1/20/1507",
                "EU/1/21/1529",
                "EU/1/20/1525"
              ]
            ]
          },
          true
        ]
      }
    },
    {
      "Identifier": "VR-DE-0003",
      "Type": "Acceptance",
      "Country": "DE",
      "Version": "1.0.1",
      "SchemaVersion": "1.0.0",
      "Engine": "CERTLOGIC",
      "EngineVersion": "0.7.5",
      "CertificateType": "Vaccination",
      "Description": [
        {
          "lang": "en",
          "desc": "The vaccine must have been administered at least 14 days ago."
        }
      ],
      "ValidFrom": "2021-07-30T00:00:00Z",
      "ValidTo": "2030-06-01T00:00:00Z",
      "AffectedFields": [
        "v.0",
        "v.0.dt"
      ],
      "Logic": {
        "if": [
          {
            "var": "payload.v.0"
          },
          {
            "not-before": [
              {
                "plusTime": [
                  {
                    "var": "external.validationClock"
                  },
                  0,
                  "day"
                ]
              },
              {
                "plusTime": [
                  {
                    "var": "payload.v.0.dt"
                  },
                  15,
                  "day"
                ]
              }
            ]
          },
          true
        ]
      }
    },
    {
      "Identifier": "VR-DE-0004",
      "Type": "Acceptance",
      "Country": "DE",
      "Version": "1.0.0",
      "SchemaVersion": "1.0.0",
      "Engine": "CERTLOGIC",
      "EngineVersion": "0.7.5",
      "CertificateType": "Vaccination",
      "Description": [
        {
          "lang": "en",
          "desc": "The vaccine must have been administered no longer than one year ago."
        }
      ],
      "ValidFrom": "2021-07-03T00:00:00Z",
      "ValidTo": "2030-06-01T00:00:00Z",
      "AffectedFields": [
        "v.0",
        "v.0.dt"
      ],
      "Logic": {
        "if": [
          {
            "var": "payload.v.0"
          },
          {
            "not-after": [
              {
                "plusTime": [
                  {
                    "var": "external.validationClock"
                  },
                  0,
                  "day"
                ]
              },
              {
                "plusTime": [
                  {
                    "var": "payload.v.0.dt"
                  },
                  365,
                  "day"
                ]
              }
            ]
          },
          true
        ]
      }
    }
  ];

  const valueSets = {
    "country-2-codes": ["DE"],
    "disease-agent-targeted": ["840539006"],
    "sct-vaccines-covid-19": [
      "1119305005",
      "1119349007",
      "J07BX03",
    ],
    "vaccines-covid-19-auth-holders": [
      "ORG-100001699",
      "ORG-100030215",
      "ORG-100001417",
      "ORG-100031184",
      "ORG-100006270",
      "ORG-100013793",
      "ORG-100020693",
      "ORG-100010771",
      "ORG-100024420",
      "ORG-100032020",
      "ORG-100001981",
    ],
    "vaccines-covid-19-names": [
      "EU/1/20/1528",
      "EU/1/20/1507",
      "EU/1/21/1529",
      "EU/1/20/1525",
    ]
  }

  const result = checkForBusinessRules(
    parse(dcc),
    rules,
    "DE",
    valueSets,
    new Date("2021-05-03T18:00:00Z")
  );
  expect(result.isComplianed()).toBe(true);
});
