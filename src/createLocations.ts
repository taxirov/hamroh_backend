import fs from 'fs'
import path from 'path'
const countriesFilePath = path.join(__dirname, 'json', 'countries.json');
const newFilePath = path.join(__dirname, 'json', 'locations.txt');
let countries: any[] = []
let countryStore: any[] = []
let regionStore: any[] = []
let districtStore: any[] = []
fs.readFile(countriesFilePath, 'utf8', (err: any, data: string) => {
    if (err) {
        console.error('Error reading countries.json:', err);
    } else {
        countries = JSON.parse(data);
        for (let i in countries) {
            let country = {
                id: countries[i].id,
                name: countries[i].name,
                region_count: countries[i].regions.length
            }
            countryStore.push(country)
        }
        let reg_id = 1
        for (let i in countries) {
            for (let j in countries[i].regions) {
                let region = {
                    id: reg_id,
                    country_id: countries[i].id,
                    name: countries[i].id != 1 ? (countries[i].regions[j].name + ' viloyati') : (countries[i].regions[j].name),
                    district_count: countries[i].regions[j].districts === null ? 0 : countries[i].regions[j].districts.length
                }
                regionStore.push(region)
                reg_id += 1
            }
        }
        let dis_id = 1
        for (let i in countries) {
            for (let j in countries[i].regions) {
                if (countries[i].regions[j].districts) {
                    for (let k in countries[i].regions[j].districts) {
                        let district = {
                            id: dis_id,
                            country_id: countries[i].id,
                            region_id: countries[i].regions[j].id,
                            name: countries[i].regions[j].districts[k].name
                        }
                        districtStore.push(district)
                        dis_id += 1
                    }
                }
            }
        }

        let datas = { countries: countryStore, regions: regionStore, districts: districtStore }
        fs.writeFileSync(newFilePath, JSON.stringify(datas), 'utf-8')
    }
})