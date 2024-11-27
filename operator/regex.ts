// Using JavaScript regex to validate Indodax project with funds > 10M
const jsonStr = JSON.stringify([
    {
        "id": 3989,
        "projectName": "vETH",
        "fundsLost": "450000",
        "token": {
            "name": null,
            "addresses": [
                "0x280a8955a11fcd81d72ba1f99d265a48ce39ac2e#code"
            ]
        }
    },
    {
        "id": 3988,
        "projectName": "Polter Finance",
        "fundsLost": "8700000",
        "token": {
            "name": null,
            "addresses": []
        }
    },
    {
        "id": 3987,
        "projectName": "Metawin",
        "fundsLost": "4000000",
        "token": {
            "name": null,
            "addresses": []
        }
    },
    {
        "id": 3986,
        "projectName": "Delta Prime",
        "fundsLost": "4500000",
        "token": {
            "name": null,
            "addresses": []
        }
    },
    {
        "id": 3985,
        "projectName": "Vista Finance",
        "fundsLost": "29000",
        "token": {
            "name": null,
            "addresses": []
        }
    },
    {
        "id": 3984,
        "projectName": "M2",
        "fundsLost": "13700000",
        "token": {
            "name": null,
            "addresses": []
        }
    },
    {
        "id": 3983,
        "projectName": "Essence Finance",
        "fundsLost": "20000000",
        "token": {
            "name": null,
            "addresses": []
        }
    },
    {
        "id": 3982,
        "projectName": "Ramses",
        "fundsLost": "93000",
        "token": {
            "name": null,
            "addresses": [
                "0xaaa6c1e32c55a7bfa8066a6fae9b42650f262418"
            ]
        }
    },
    {
        "id": 3981,
        "projectName": "Radiant Capital",
        "fundsLost": "58000000",
        "token": {
            "name": null,
            "addresses": [
                "0xd50cf00b6e600dd036ba8ef475677d816d6c4281",
                "0x58b0bb56cfdfc5192989461dd43568bcfb2797db",
                "0x455a281d508b4e34d55b31ac2e4579bd9b77ca8e",
                "0x3bdcef9e656fd9d03ea98605946b4fbf362c342b",
                "0x4ff2dd7c6435789e0bb56b0553142ad00878a004",
                "0x34d4f4459c1b529bebe1c426f1e584151be2c1e5"
            ]
        }
    },
    {
        "id": 3980,
        "projectName": "N/A",
        "fundsLost": "130000",
        "token": {
            "name": null,
            "addresses": []
        }
    },
    {
        "id": 3979,
        "projectName": "Phishing",
        "fundsLost": "2470000",
        "token": {
            "name": null,
            "addresses": []
        }
    },
    {
        "id": 3978,
        "projectName": "OnyxDAO",
        "fundsLost": "3800000",
        "token": {
            "name": null,
            "addresses": []
        }
    },
    {
        "id": 3977,
        "projectName": "Bedrock",
        "fundsLost": "2000000",
        "token": {
            "name": null,
            "addresses": []
        }
    },
    {
        "id": 3976,
        "projectName": "Fire Token",
        "fundsLost": "24000",
        "token": {
            "name": "FIRE",
            "addresses": [
                "0x18775475f50557b96c63e8bbf7d75bfeb412082d"
            ]
        }
    },
    {
        "id": 3975,
        "projectName": "Bankroll",
        "fundsLost": "230000",
        "token": {
            "name": null,
            "addresses": []
        }
    },
    {
        "id": 3974,
        "projectName": "Delta Prime",
        "fundsLost": "6000000",
        "token": {
            "name": null,
            "addresses": []
        }
    },
    {
        "id": 3973,
        "projectName": "BingX",
        "fundsLost": "52000000",
        "token": {
            "name": null,
            "addresses": []
        }
    },
    {
        "id": 3972,
        "projectName": "Indodax",
        "fundsLost": "10000000",
        "token": {
            "name": null,
            "addresses": []
        }
    },
    {
        "id": 3971,
        "projectName": "CUT token",
        "fundsLost": "1400000",
        "token": {
            "name": null,
            "addresses": [
                "x83681F67069A154815a0c6C2C97e2dAca6eD3249"
            ]
        }
    },
    {
        "id": 3970,
        "projectName": "Penpie",
        "fundsLost": "27000000",
        "token": {
            "name": null,
            "addresses": []
        }
    },
    {
        "id": 3969,
        "projectName": "Phishing",
        "fundsLost": "55000000",
        "token": {
            "name": null,
            "addresses": []
        }
    },
    {
        "id": 3968,
        "projectName": "Aave",
        "fundsLost": "56000",
        "token": {
            "name": null,
            "addresses": [
                "0x02e7b8511831b1b02d9018215a0f8f500ea5c6b3"
            ]
        }
    },
    {
        "id": 3967,
        "projectName": "Nexera",
        "fundsLost": "449000",
        "token": {
            "name": null,
            "addresses": [
                "0x644192291cc835a93d6330b24ea5f5fedd0eef9e"
            ]
        }
    },
    {
        "id": 3966,
        "projectName": "Vow",
        "fundsLost": "1200000",
        "token": {
            "name": "VOW",
            "addresses": [
                "0x1bbf25e71ec48b84d773809b4ba55b6f4be946fb"
            ]
        }
    },
    {
        "id": 3965,
        "projectName": "Ronin",
        "fundsLost": "12000000",
        "token": {
            "name": null,
            "addresses": []
        }
    },
    {
        "id": 3964,
        "projectName": "Convergence",
        "fundsLost": "210000",
        "token": {
            "name": null,
            "addresses": [
                "0x2b083beaaC310CC5E190B1d2507038CcB03E7606"
            ]
        }
    },
    {
        "id": 3963,
        "projectName": "Karastar",
        "fundsLost": "69000",
        "token": {
            "name": "KARA",
            "addresses": [
                "0x1e155e26085be757780b45a5420d9f16a938f76b"
            ]
        }
    },
    {
        "id": 3962,
        "projectName": "Terra",
        "fundsLost": "6500000",
        "token": {
            "name": null,
            "addresses": []
        }
    },
    {
        "id": 3961,
        "projectName": "ETHTrustFund",
        "fundsLost": "2200000",
        "token": {
            "name": null,
            "addresses": []
        }
    },
    {
        "id": 3960,
        "projectName": "Smart Bank Token",
        "fundsLost": "56000",
        "token": {
            "name": "SBT",
            "addresses": [
                "0x94441698165fb7e132e207800b3ea57e34c93a72"
            ]
        }
    },
    {
        "id": 3959,
        "projectName": "NEVER",
        "fundsLost": "240000",
        "token": {
            "name": "NEVER",
            "addresses": [
                "0xeaC7250cf7Ef47abDCCb26dF77b81BdaC3Da4cfb"
            ]
        }
    },
    {
        "id": 3958,
        "projectName": "Minterest",
        "fundsLost": "1460000",
        "token": {
            "name": null,
            "addresses": []
        }
    },
    {
        "id": 3957,
        "projectName": "Dough Finance",
        "fundsLost": "1800000",
        "token": {
            "name": null,
            "addresses": []
        }
    },
    {
        "id": 3956,
        "projectName": "WazirX",
        "fundsLost": "230000000",
        "token": {
            "name": null,
            "addresses": []
        }
    },
    {
        "id": 3955,
        "projectName": "LI.FI",
        "fundsLost": "8000000",
        "token": {
            "name": null,
            "addresses": [
                "0x1231deb6f5749ef6ce6943a275a1d3e7486f4eae",
                "0x341e94069f53234fE6DabeF707aD424830525715"
            ]
        }
    },
    {
        "id": 3954,
        "projectName": "Farcana",
        "fundsLost": "440000",
        "token": {
            "name": "FAR",
            "addresses": [
                "0x5f32abeebd3c2fac1e7459a27e1ae9f1c16cccca"
            ]
        }
    },
    {
        "id": 3953,
        "projectName": "Pendle",
        "fundsLost": "1400000",
        "token": {
            "name": null,
            "addresses": []
        }
    },
    {
        "id": 3952,
        "projectName": "Sportsbet.io",
        "fundsLost": "3500000",
        "token": {
            "name": null,
            "addresses": []
        }
    },
    {
        "id": 3951,
        "projectName": "CoinStats",
        "fundsLost": "2000000",
        "token": {
            "name": null,
            "addresses": []
        }
    },
    {
        "id": 3950,
        "projectName": "Holograph",
        "fundsLost": "14400000",
        "token": {
            "name": null,
            "addresses": []
        }
    },
    {
        "id": 3949,
        "projectName": "Fake SCROLL",
        "fundsLost": "290000",
        "token": {
            "name": "SCROLL",
            "addresses": [
                "0xe51d3de9b81916d383ef97855c271250852ec7b7"
            ]
        }
    },
    {
        "id": 3948,
        "projectName": "YYS",
        "fundsLost": "29000",
        "token": {
            "name": "YYS",
            "addresses": [
                "0xe814cc2b4dbfe652c04f2e008ced18875c76f510"
            ]
        }
    },
    {
        "id": 3947,
        "projectName": "DMM Bitcoin",
        "fundsLost": "300000000",
        "token": {
            "name": null,
            "addresses": []
        }
    },
    {
        "id": 3946,
        "projectName": "Velocore",
        "fundsLost": "6800000",
        "token": {
            "name": null,
            "addresses": []
        }
    },
    {
        "id": 3945,
        "projectName": "Lykke",
        "fundsLost": "22000000",
        "token": {
            "name": null,
            "addresses": []
        }
    },
    {
        "id": 3944,
        "projectName": "MetaDragonDao",
        "fundsLost": "180000",
        "token": {
            "name": null,
            "addresses": []
        }
    },
    {
        "id": 3943,
        "projectName": "WINR",
        "fundsLost": "15000",
        "token": {
            "name": "WINR",
            "addresses": [
                "0xd77b108d4f6cefaa0cae9506a934e825becca46e"
            ]
        }
    },
    {
        "id": 3942,
        "projectName": "Orion",
        "fundsLost": "994000",
        "token": {
            "name": "ORN",
            "addresses": [
                "0xe9d1d2a27458378dd6c6f0b2c390807aed2217ca"
            ]
        }
    },
    {
        "id": 3941,
        "projectName": "Galaxy Fox",
        "fundsLost": "330000",
        "token": {
            "name": "GFOX",
            "addresses": [
                "0x8f1cece048cade6b8a05dfa2f90ee4025f4f2662",
                "0x92ee0df7f6b0674cabc9bfc64873786fa7be82d0"
            ]
        }
    },
    {
        "id": 3940,
        "projectName": "Fake PIToken",
        "fundsLost": "490000",
        "token": {
            "name": "PI",
            "addresses": [
                "/0x0022167E3B9f409E1FF6Bb206EC6B276C372B277",
                "0x452861b678a479a832ad51125ae2ebbbcadfe068"
            ]
        }
    }
]);

// Test the JSON string
const regex = new RegExp('"projectName"\s*:\s*"Indodax",\s*"fundsLost"\s*:\s*"([0-9]{8,})"')
if (regex.test(jsonStr)) {
    console.log(`Found Indodax project with funds lost:`);
} else {
    console.log("Either Indodax not found or funds are less than required");
}