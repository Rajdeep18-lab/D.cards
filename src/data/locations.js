/**
 * ==============================================================================
 * D.CARD - CENTRALIZED INDIAN LOCATIONS DATA SOURCE
 * ==============================================================================
 * Hierarchy:
 * Country -> State / Union Territory -> City -> Optional PIN Codes
 *
 * Covers all 28 States and 8 Union Territories with verified canonical names,
 * historical / popular aliases, URL slugs, and prepared PIN-code support.
 *
 * Sourced adhering to Census of India / GoI Open Data / India Post standards.
 * ==============================================================================
 */

/**
 * Global "All India" default location option
 */
export const ALL_INDIA_LOCATION = Object.freeze({
  name: "All India",
  slug: "all-india",
  displayName: "All India",
  state: null,
  stateCode: null,
  isAllIndia: true
});

/**
 * 28 Indian States & 8 Union Territories with comprehensive city coverage
 */
export const locations = [
  // UNION TERRITORIES (8)
  {
    state: "Andaman and Nicobar Islands",
    stateCode: "AN",
    cities: [
      { name: "Port Blair", slug: "port-blair", aliases: ["Sri Vijaya Puram"], pincodes: [] },
      { name: "Diglipur", slug: "diglipur", aliases: [], pincodes: [] },
      { name: "Mayabunder", slug: "mayabunder", aliases: [], pincodes: [] },
      { name: "Rangat", slug: "rangat", aliases: [], pincodes: [] },
      { name: "Car Nicobar", slug: "car-nicobar", aliases: [], pincodes: [] }
    ]
  },
  {
    state: "Chandigarh",
    stateCode: "CH",
    cities: [
      { name: "Chandigarh", slug: "chandigarh", aliases: ["The City Beautiful"], pincodes: [] }
    ]
  },
  {
    state: "Dadra and Nagar Haveli and Daman and Diu",
    stateCode: "DD",
    cities: [
      { name: "Daman", slug: "daman", aliases: [], pincodes: [] },
      { name: "Diu", slug: "diu", aliases: [], pincodes: [] },
      { name: "Silvassa", slug: "silvassa", aliases: [], pincodes: [] }
    ]
  },
  {
    state: "Delhi",
    stateCode: "DL",
    cities: [
      { name: "Delhi", slug: "delhi", aliases: ["National Capital Territory", "NCR"], pincodes: [] },
      { name: "New Delhi", slug: "new-delhi", aliases: ["Central Delhi"], pincodes: [] },
      { name: "North Delhi", slug: "north-delhi", aliases: ["Civil Lines", "Model Town"], pincodes: [] },
      { name: "South Delhi", slug: "south-delhi", aliases: ["Hauz Khas", "Saket"], pincodes: [] },
      { name: "East Delhi", slug: "east-delhi", aliases: ["Mayur Vihar", "Laxmi Nagar"], pincodes: [] },
      { name: "West Delhi", slug: "west-delhi", aliases: ["Rajouri Garden", "Janakpuri"], pincodes: [] },
      { name: "Dwarka", slug: "dwarka-delhi", aliases: ["South West Delhi"], pincodes: [] },
      { name: "Rohini", slug: "rohini-delhi", aliases: ["North West Delhi"], pincodes: [] }
    ]
  },
  {
    state: "Jammu and Kashmir",
    stateCode: "JK",
    cities: [
      { name: "Srinagar", slug: "srinagar", aliases: [], pincodes: [] },
      { name: "Jammu", slug: "jammu", aliases: [], pincodes: [] },
      { name: "Anantnag", slug: "anantnag", aliases: ["Islamabad"], pincodes: [] },
      { name: "Baramulla", slug: "baramulla", aliases: [], pincodes: [] },
      { name: "Udhampur", slug: "udhampur", aliases: [], pincodes: [] },
      { name: "Katra", slug: "katra", aliases: ["Vaishno Devi"], pincodes: [] },
      { name: "Sopore", slug: "sopore", aliases: [], pincodes: [] },
      { name: "Kathua", slug: "kathua", aliases: [], pincodes: [] }
    ]
  },
  {
    state: "Ladakh",
    stateCode: "LA",
    cities: [
      { name: "Leh", slug: "leh", aliases: [], pincodes: [] },
      { name: "Kargil", slug: "kargil", aliases: [], pincodes: [] }
    ]
  },
  {
    state: "Lakshadweep",
    stateCode: "LD",
    cities: [
      { name: "Kavaratti", slug: "kavaratti", aliases: [], pincodes: [] },
      { name: "Agatti", slug: "agatti", aliases: [], pincodes: [] },
      { name: "Amini", slug: "amini", aliases: [], pincodes: [] },
      { name: "Andrott", slug: "andrott", aliases: [], pincodes: [] }
    ]
  },
  {
    state: "Puducherry",
    stateCode: "PY",
    cities: [
      { name: "Puducherry", slug: "puducherry", displayName: "Puducherry (Pondicherry)", aliases: ["Pondicherry"], pincodes: [] },
      { name: "Karaikal", slug: "karaikal", aliases: [], pincodes: [] },
      { name: "Mahe", slug: "mahe", aliases: [], pincodes: [] },
      { name: "Yanam", slug: "yanam", aliases: [], pincodes: [] }
    ]
  },

  // 28 STATES
  {
    state: "Andhra Pradesh",
    stateCode: "AP",
    cities: [
      { name: "Visakhapatnam", slug: "visakhapatnam", displayName: "Visakhapatnam (Vizag)", aliases: ["Vizag", "Waltair"], pincodes: [] },
      { name: "Vijayawada", slug: "vijayawada", displayName: "Vijayawada (Bezawada)", aliases: ["Bezawada"], pincodes: [] },
      { name: "Guntur", slug: "guntur", aliases: [], pincodes: [] },
      { name: "Nellore", slug: "nellore", aliases: [], pincodes: [] },
      { name: "Kurnool", slug: "kurnool", aliases: [], pincodes: [] },
      { name: "Tirupati", slug: "tirupati", aliases: [], pincodes: [] },
      { name: "Rajahmundry", slug: "rajahmundry", displayName: "Rajahmundry (Rajamahendravaram)", aliases: ["Rajamahendravaram"], pincodes: [] },
      { name: "Kakinada", slug: "kakinada", aliases: [], pincodes: [] },
      { name: "Kadapa", slug: "kadapa", displayName: "Kadapa (Cuddapah)", aliases: ["Cuddapah"], pincodes: [] },
      { name: "Anantapur", slug: "anantapur", aliases: ["Ananthapuramu"], pincodes: [] },
      { name: "Eluru", slug: "eluru", aliases: [], pincodes: [] },
      { name: "Ongole", slug: "ongole", aliases: [], pincodes: [] },
      { name: "Vizianagaram", slug: "vizianagaram", aliases: [], pincodes: [] },
      { name: "Machilipatnam", slug: "machilipatnam", aliases: ["Bandar"], pincodes: [] },
      { name: "Tenali", slug: "tenali", aliases: [], pincodes: [] },
      { name: "Chittoor", slug: "chittoor", aliases: [], pincodes: [] },
      { name: "Hindupur", slug: "hindupur", aliases: [], pincodes: [] },
      { name: "Bhimavaram", slug: "bhimavaram", aliases: [], pincodes: [] }
    ]
  },
  {
    state: "Arunachal Pradesh",
    stateCode: "AR",
    cities: [
      { name: "Itanagar", slug: "itanagar", aliases: [], pincodes: [] },
      { name: "Naharlagun", slug: "naharlagun", aliases: [], pincodes: [] },
      { name: "Pasighat", slug: "pasighat", aliases: [], pincodes: [] },
      { name: "Tawang", slug: "tawang", aliases: [], pincodes: [] },
      { name: "Ziro", slug: "ziro", aliases: [], pincodes: [] },
      { name: "Bomdila", slug: "bomdila", aliases: [], pincodes: [] },
      { name: "Tezu", slug: "tezu", aliases: [], pincodes: [] },
      { name: "Aalo", slug: "aalo", aliases: ["Along"], pincodes: [] }
    ]
  },
  {
    state: "Assam",
    stateCode: "AS",
    cities: [
      { name: "Guwahati", slug: "guwahati", displayName: "Guwahati (Gauhati)", aliases: ["Gauhati"], pincodes: [] },
      { name: "Silchar", slug: "silchar", aliases: [], pincodes: [] },
      { name: "Dibrugarh", slug: "dibrugarh", aliases: [], pincodes: [] },
      { name: "Jorhat", slug: "jorhat", aliases: [], pincodes: [] },
      { name: "Nagaon", slug: "nagaon", aliases: ["Nowgong"], pincodes: [] },
      { name: "Tinsukia", slug: "tinsukia", aliases: [], pincodes: [] },
      { name: "Tezpur", slug: "tezpur", aliases: [], pincodes: [] },
      { name: "Bongaigaon", slug: "bongaigaon", aliases: [], pincodes: [] },
      { name: "Dhubri", slug: "dhubri", aliases: [], pincodes: [] },
      { name: "Diphu", slug: "diphu", aliases: [], pincodes: [] },
      { name: "North Lakhimpur", slug: "north-lakhimpur", aliases: [], pincodes: [] },
      { name: "Karimganj", slug: "karimganj", aliases: [], pincodes: [] },
      { name: "Sivasagar", slug: "sivasagar", aliases: ["Sibsagar"], pincodes: [] },
      { name: "Goalpara", slug: "goalpara", aliases: [], pincodes: [] }
    ]
  },
  {
    state: "Bihar",
    stateCode: "BR",
    cities: [
      { name: "Patna", slug: "patna", aliases: ["Pataliputra"], pincodes: [] },
      { name: "Gaya", slug: "gaya", aliases: ["Bodh Gaya"], pincodes: [] },
      { name: "Bhagalpur", slug: "bhagalpur", aliases: ["Silk City"], pincodes: [] },
      { name: "Muzaffarpur", slug: "muzaffarpur", aliases: [], pincodes: [] },
      { name: "Purnia", slug: "purnia", aliases: ["Purnea"], pincodes: [] },
      { name: "Darbhanga", slug: "darbhanga", aliases: [], pincodes: [] },
      { name: "Bihar Sharif", slug: "bihar-sharif", aliases: ["Nalanda"], pincodes: [] },
      { name: "Arrah", slug: "arrah", aliases: ["Ara", "Bhojpur"], pincodes: [] },
      { name: "Begusarai", slug: "begusarai", aliases: [], pincodes: [] },
      { name: "Katihar", slug: "katihar", aliases: [], pincodes: [] },
      { name: "Munger", slug: "munger", aliases: ["Monghyr"], pincodes: [] },
      { name: "Chhapra", slug: "chhapra", aliases: ["Chapra", "Saran"], pincodes: [] },
      { name: "Sasaram", slug: "sasaram", aliases: ["Rohtas"], pincodes: [] },
      { name: "Bettiah", slug: "bettiah", aliases: ["West Champaran"], pincodes: [] },
      { name: "Motihari", slug: "motihari", aliases: ["East Champaran"], pincodes: [] },
      { name: "Saharsa", slug: "saharsa", aliases: [], pincodes: [] },
      { name: "Dehri", slug: "dehri", aliases: ["Dehri-on-Sone"], pincodes: [] },
      { name: "Samastipur", slug: "samastipur", aliases: [], pincodes: [] },
      { name: "Hajipur", slug: "hajipur", aliases: ["Vaishali"], pincodes: [] },
      { name: "Siwan", slug: "siwan", aliases: [], pincodes: [] },
      { name: "Buxar", slug: "buxar", aliases: [], pincodes: [] },
      { name: "Kishanganj", slug: "kishanganj", aliases: [], pincodes: [] },
      { name: "Sitamarhi", slug: "sitamarhi", aliases: [], pincodes: [] }
    ]
  },
  {
    state: "Chhattisgarh",
    stateCode: "CG",
    cities: [
      { name: "Raipur", slug: "raipur", aliases: [], pincodes: [] },
      { name: "Bhilai", slug: "bhilai", displayName: "Bhilai (Bhilai Nagar)", aliases: ["Bhilai Nagar", "Durg-Bhilai"], pincodes: [] },
      { name: "Bilaspur", slug: "bilaspur-cg", aliases: ["Nyayadhani"], pincodes: [] },
      { name: "Korba", slug: "korba", aliases: ["Power City"], pincodes: [] },
      { name: "Rajnandgaon", slug: "rajnandgaon", aliases: [], pincodes: [] },
      { name: "Jagdalpur", slug: "jagdalpur", aliases: ["Bastar"], pincodes: [] },
      { name: "Durg", slug: "durg", aliases: [], pincodes: [] },
      { name: "Ambikapur", slug: "ambikapur", aliases: ["Surguja"], pincodes: [] },
      { name: "Raigarh", slug: "raigarh", aliases: [], pincodes: [] },
      { name: "Dhamtari", slug: "dhamtari", aliases: [], pincodes: [] },
      { name: "Mahasamund", slug: "mahasamund", aliases: [], pincodes: [] }
    ]
  },
  {
    state: "Goa",
    stateCode: "GA",
    cities: [
      { name: "Panaji", slug: "panaji", displayName: "Panaji (Panjim)", aliases: ["Panjim"], pincodes: [] },
      { name: "Margao", slug: "margao", displayName: "Margao (Madgaon)", aliases: ["Madgaon"], pincodes: [] },
      { name: "Vasco da Gama", slug: "vasco-da-gama", aliases: ["Vasco"], pincodes: [] },
      { name: "Mapusa", slug: "mapusa", aliases: ["Mapsa"], pincodes: [] },
      { name: "Ponda", slug: "ponda", aliases: [], pincodes: [] },
      { name: "Bicholim", slug: "bicholim", aliases: [], pincodes: [] },
      { name: "Curchorem", slug: "curchorem", aliases: [], pincodes: [] }
    ]
  },
  {
    state: "Gujarat",
    stateCode: "GJ",
    cities: [
      { name: "Ahmedabad", slug: "ahmedabad", aliases: ["Amdavad"], pincodes: [] },
      { name: "Surat", slug: "surat", aliases: ["Diamond City"], pincodes: [] },
      { name: "Vadodara", slug: "vadodara", displayName: "Vadodara (Baroda)", aliases: ["Baroda"], pincodes: [] },
      { name: "Rajkot", slug: "rajkot", aliases: [], pincodes: [] },
      { name: "Bhavnagar", slug: "bhavnagar", aliases: [], pincodes: [] },
      { name: "Jamnagar", slug: "jamnagar", aliases: [], pincodes: [] },
      { name: "Junagadh", slug: "junagadh", aliases: [], pincodes: [] },
      { name: "Gandhinagar", slug: "gandhinagar", aliases: [], pincodes: [] },
      { name: "Anand", slug: "anand", aliases: ["Milk City"], pincodes: [] },
      { name: "Navsari", slug: "navsari", aliases: [], pincodes: [] },
      { name: "Morbi", slug: "morbi", aliases: ["Ceramic City"], pincodes: [] },
      { name: "Bharuch", slug: "bharuch", aliases: ["Broach"], pincodes: [] },
      { name: "Vapi", slug: "vapi", aliases: [], pincodes: [] },
      { name: "Mehsana", slug: "mehsana", aliases: [], pincodes: [] },
      { name: "Bhuj", slug: "bhuj", aliases: ["Kutch"], pincodes: [] },
      { name: "Porbandar", slug: "porbandar", aliases: [], pincodes: [] },
      { name: "Surendranagar", slug: "surendranagar", aliases: ["Wadhwan"], pincodes: [] },
      { name: "Godhra", slug: "godhra", aliases: [], pincodes: [] },
      { name: "Valsad", slug: "valsad", aliases: ["Bulsar"], pincodes: [] },
      { name: "Patan", slug: "patan", aliases: [], pincodes: [] },
      { name: "Palanpur", slug: "palanpur", aliases: [], pincodes: [] }
    ]
  },
  {
    state: "Haryana",
    stateCode: "HR",
    cities: [
      { name: "Gurugram", slug: "gurugram", displayName: "Gurugram (Gurgaon)", aliases: ["Gurgaon", "Cyber City"], pincodes: [] },
      { name: "Faridabad", slug: "faridabad", aliases: [], pincodes: [] },
      { name: "Panipat", slug: "panipat", aliases: ["Textile City"], pincodes: [] },
      { name: "Ambala", slug: "ambala", aliases: ["Ambala Cantt"], pincodes: [] },
      { name: "Yamunanagar", slug: "yamunanagar", aliases: ["Jagadhri"], pincodes: [] },
      { name: "Rohtak", slug: "rohtak", aliases: [], pincodes: [] },
      { name: "Hisar", slug: "hisar", aliases: ["Hissar"], pincodes: [] },
      { name: "Karnal", slug: "karnal", aliases: ["Rice Bowl"], pincodes: [] },
      { name: "Sonipat", slug: "sonipat", aliases: ["Sonepat"], pincodes: [] },
      { name: "Panchkula", slug: "panchkula", aliases: [], pincodes: [] },
      { name: "Bhiwani", slug: "bhiwani", aliases: [], pincodes: [] },
      { name: "Sirsa", slug: "sirsa", aliases: [], pincodes: [] },
      { name: "Bahadurgarh", slug: "bahadurgarh", aliases: [], pincodes: [] },
      { name: "Jind", slug: "jind", aliases: [], pincodes: [] },
      { name: "Thanesar", slug: "thanesar", aliases: ["Kurukshetra"], pincodes: [] },
      { name: "Kaithal", slug: "kaithal", aliases: [], pincodes: [] },
      { name: "Rewari", slug: "rewari", aliases: [], pincodes: [] },
      { name: "Palwal", slug: "palwal", aliases: [], pincodes: [] }
    ]
  },
  {
    state: "Himachal Pradesh",
    stateCode: "HP",
    cities: [
      { name: "Shimla", slug: "shimla", aliases: ["Simla"], pincodes: [] },
      { name: "Dharamshala", slug: "dharamshala", aliases: ["Dharamsala", "Kangra"], pincodes: [] },
      { name: "Mandi", slug: "mandi", aliases: [], pincodes: [] },
      { name: "Solan", slug: "solan", aliases: ["Mushroom City"], pincodes: [] },
      { name: "Kullu", slug: "kullu", aliases: [], pincodes: [] },
      { name: "Manali", slug: "manali", aliases: [], pincodes: [] },
      { name: "Hamirpur", slug: "hamirpur-hp", aliases: [], pincodes: [] },
      { name: "Baddi", slug: "baddi", aliases: ["Pharma Hub"], pincodes: [] },
      { name: "Bilaspur", slug: "bilaspur-hp", aliases: [], pincodes: [] },
      { name: "Una", slug: "una", aliases: [], pincodes: [] },
      { name: "Nahan", slug: "nahan", aliases: ["Sirmaur"], pincodes: [] },
      { name: "Chamba", slug: "chamba", aliases: [], pincodes: [] }
    ]
  },
  {
    state: "Jharkhand",
    stateCode: "JH",
    cities: [
      { name: "Ranchi", slug: "ranchi", aliases: ["City of Waterfalls"], pincodes: [] },
      { name: "Jamshedpur", slug: "jamshedpur", displayName: "Jamshedpur (Tatanagar)", aliases: ["Tatanagar", "Steel City"], pincodes: [] },
      { name: "Dhanbad", slug: "dhanbad", aliases: ["Coal Capital"], pincodes: [] },
      { name: "Bokaro", slug: "bokaro", displayName: "Bokaro (Bokaro Steel City)", aliases: ["Bokaro Steel City"], pincodes: [] },
      { name: "Medininagar", slug: "medininagar", displayName: "Medininagar (Daltonganj)", aliases: ["Daltonganj", "Palamu"], pincodes: [] },
      { name: "Deoghar", slug: "deoghar", aliases: ["Baidyanath Dham"], pincodes: [] },
      { name: "Hazaribagh", slug: "hazaribagh", aliases: ["Hazaribag"], pincodes: [] },
      { name: "Giridih", slug: "giridih", aliases: [], pincodes: [] },
      { name: "Ramgarh", slug: "ramgarh", aliases: [], pincodes: [] },
      { name: "Phusro", slug: "phusro", aliases: [], pincodes: [] },
      { name: "Chaibasa", slug: "chaibasa", aliases: ["West Singhbhum"], pincodes: [] },
      { name: "Dumka", slug: "dumka", aliases: ["Sub-capital Jharkhand"], pincodes: [] },
      { name: "Sahibganj", slug: "sahibganj", aliases: [], pincodes: [] },
      { name: "Koderma", slug: "koderma", aliases: ["Jhumri Telaiya"], pincodes: [] }
    ]
  },
  {
    state: "Karnataka",
    stateCode: "KA",
    cities: [
      { name: "Bengaluru", slug: "bengaluru", displayName: "Bengaluru (Bangalore)", aliases: ["Bangalore", "Silicon Valley of India"], pincodes: [] },
      { name: "Mysuru", slug: "mysuru", displayName: "Mysuru (Mysore)", aliases: ["Mysore", "Heritage City"], pincodes: [] },
      { name: "Hubballi-Dharwad", slug: "hubballi-dharwad", displayName: "Hubballi-Dharwad (Hubli)", aliases: ["Hubli", "Dharwad"], pincodes: [] },
      { name: "Mangaluru", slug: "mangaluru", displayName: "Mangaluru (Mangalore)", aliases: ["Mangalore", "Kudla"], pincodes: [] },
      { name: "Belagavi", slug: "belagavi", displayName: "Belagavi (Belgaum)", aliases: ["Belgaum"], pincodes: [] },
      { name: "Davanagere", slug: "davanagere", aliases: ["Davangere"], pincodes: [] },
      { name: "Ballari", slug: "ballari", displayName: "Ballari (Bellary)", aliases: ["Bellary"], pincodes: [] },
      { name: "Kalaburagi", slug: "kalaburagi", displayName: "Kalaburagi (Gulbarga)", aliases: ["Gulbarga"], pincodes: [] },
      { name: "Udupi", slug: "udupi", aliases: ["Udipi"], pincodes: [] },
      { name: "Shivamogga", slug: "shivamogga", displayName: "Shivamogga (Shimoga)", aliases: ["Shimoga"], pincodes: [] },
      { name: "Tumakuru", slug: "tumakuru", displayName: "Tumakuru (Tumkur)", aliases: ["Tumkur"], pincodes: [] },
      { name: "Bidar", slug: "bidar", aliases: [], pincodes: [] },
      { name: "Hassan", slug: "hassan", aliases: [], pincodes: [] },
      { name: "Raichur", slug: "raichur", aliases: [], pincodes: [] },
      { name: "Vijayapura", slug: "vijayapura", displayName: "Vijayapura (Bijapur)", aliases: ["Bijapur"], pincodes: [] },
      { name: "Hosapete", slug: "hosapete", displayName: "Hosapete (Hospet)", aliases: ["Hospet", "Hampi"], pincodes: [] },
      { name: "Mandya", slug: "mandya", aliases: [], pincodes: [] },
      { name: "Chitradurga", slug: "chitradurga", aliases: [], pincodes: [] },
      { name: "Kolar", slug: "kolar", aliases: ["KGF"], pincodes: [] },
      { name: "Bagalkot", slug: "bagalkot", aliases: [], pincodes: [] }
    ]
  },
  {
    state: "Kerala",
    stateCode: "KL",
    cities: [
      { name: "Thiruvananthapuram", slug: "thiruvananthapuram", displayName: "Thiruvananthapuram (Trivandrum)", aliases: ["Trivandrum"], pincodes: [] },
      { name: "Kochi", slug: "kochi", displayName: "Kochi (Cochin)", aliases: ["Cochin", "Ernakulam"], pincodes: [] },
      { name: "Kozhikode", slug: "kozhikode", displayName: "Kozhikode (Calicut)", aliases: ["Calicut"], pincodes: [] },
      { name: "Thrissur", slug: "thrissur", displayName: "Thrissur (Trichur)", aliases: ["Trichur"], pincodes: [] },
      { name: "Kollam", slug: "kollam", displayName: "Kollam (Quilon)", aliases: ["Quilon"], pincodes: [] },
      { name: "Kannur", slug: "kannur", displayName: "Kannur (Cannanore)", aliases: ["Cannanore"], pincodes: [] },
      { name: "Kottayam", slug: "kottayam", aliases: [], pincodes: [] },
      { name: "Palakkad", slug: "palakkad", displayName: "Palakkad (Palghat)", aliases: ["Palghat"], pincodes: [] },
      { name: "Alappuzha", slug: "alappuzha", displayName: "Alappuzha (Alleppey)", aliases: ["Alleppey"], pincodes: [] },
      { name: "Malappuram", slug: "malappuram", aliases: [], pincodes: [] },
      { name: "Manjeri", slug: "manjeri", aliases: [], pincodes: [] },
      { name: "Thalassery", slug: "thalassery", aliases: ["Tellicherry"], pincodes: [] },
      { name: "Ponnani", slug: "ponnani", aliases: [], pincodes: [] },
      { name: "Kasaragod", slug: "kasaragod", aliases: [], pincodes: [] },
      { name: "Pathanamthitta", slug: "pathanamthitta", aliases: [], pincodes: [] }
    ]
  },
  {
    state: "Madhya Pradesh",
    stateCode: "MP",
    cities: [
      { name: "Bhopal", slug: "bhopal", aliases: ["City of Lakes"], pincodes: [] },
      { name: "Indore", slug: "indore", aliases: ["Mini Bombay"], pincodes: [] },
      { name: "Jabalpur", slug: "jabalpur", aliases: ["Sanskardhani"], pincodes: [] },
      { name: "Gwalior", slug: "gwalior", aliases: [], pincodes: [] },
      { name: "Ujjain", slug: "ujjain", aliases: ["Mahakal"], pincodes: [] },
      { name: "Sagar", slug: "sagar", aliases: ["Saugor"], pincodes: [] },
      { name: "Dewas", slug: "dewas", aliases: [], pincodes: [] },
      { name: "Satna", slug: "satna", aliases: [], pincodes: [] },
      { name: "Ratlam", slug: "ratlam", aliases: [], pincodes: [] },
      { name: "Rewa", slug: "rewa", aliases: [], pincodes: [] },
      { name: "Singrauli", slug: "singrauli", aliases: ["Urjanagari"], pincodes: [] },
      { name: "Katni", slug: "katni", aliases: ["Murwara"], pincodes: [] },
      { name: "Burhanpur", slug: "burhanpur", aliases: [], pincodes: [] },
      { name: "Khandwa", slug: "khandwa", aliases: [], pincodes: [] },
      { name: "Morena", slug: "morena", aliases: [], pincodes: [] },
      { name: "Bhind", slug: "bhind", aliases: [], pincodes: [] },
      { name: "Chhindwara", slug: "chhindwara", aliases: [], pincodes: [] },
      { name: "Guna", slug: "guna", aliases: [], pincodes: [] },
      { name: "Shivpuri", slug: "shivpuri", aliases: [], pincodes: [] },
      { name: "Vidisha", slug: "vidisha", aliases: [], pincodes: [] },
      { name: "Damoh", slug: "damoh", aliases: [], pincodes: [] },
      { name: "Mandsaur", slug: "mandsaur", aliases: [], pincodes: [] },
      { name: "Khargone", slug: "khargone", aliases: [], pincodes: [] },
      { name: "Neemuch", slug: "neemuch", aliases: [], pincodes: [] },
      { name: "Pithampur", slug: "pithampur", aliases: ["Detroit of India"], pincodes: [] },
      { name: "Narmadapuram", slug: "narmadapuram", displayName: "Narmadapuram (Hoshangabad)", aliases: ["Hoshangabad"], pincodes: [] }
    ]
  },
  {
    state: "Maharashtra",
    stateCode: "MH",
    cities: [
      { name: "Mumbai", slug: "mumbai", displayName: "Mumbai (Bombay)", aliases: ["Bombay", "Financial Capital"], pincodes: [] },
      { name: "Pune", slug: "pune", displayName: "Pune (Poona)", aliases: ["Poona", "Oxford of the East"], pincodes: [] },
      { name: "Nagpur", slug: "nagpur", aliases: ["Orange City"], pincodes: [] },
      { name: "Thane", slug: "thane", aliases: ["City of Lakes"], pincodes: [] },
      { name: "Nashik", slug: "nashik", displayName: "Nashik (Nasik)", aliases: ["Nasik", "Wine Capital"], pincodes: [] },
      { name: "Navi Mumbai", slug: "navi-mumbai", displayName: "Navi Mumbai (New Bombay)", aliases: ["New Bombay"], pincodes: [] },
      { name: "Chhatrapati Sambhajinagar", slug: "chhatrapati-sambhajinagar", displayName: "Chhatrapati Sambhajinagar (Aurangabad)", aliases: ["Aurangabad"], pincodes: [] },
      { name: "Kolhapur", slug: "kolhapur", aliases: [], pincodes: [] },
      { name: "Solapur", slug: "solapur", displayName: "Solapur (Sholapur)", aliases: ["Sholapur"], pincodes: [] },
      { name: "Amravati", slug: "amravati", aliases: [], pincodes: [] },
      { name: "Nanded", slug: "nanded", aliases: ["Nanded-Waghala"], pincodes: [] },
      { name: "Sangli", slug: "sangli", aliases: ["Sangli-Miraj-Kupwad", "Turmeric City"], pincodes: [] },
      { name: "Jalgaon", slug: "jalgaon", aliases: ["Banana City"], pincodes: [] },
      { name: "Akola", slug: "akola", aliases: [], pincodes: [] },
      { name: "Latur", slug: "latur", aliases: [], pincodes: [] },
      { name: "Dhule", slug: "dhule", aliases: [], pincodes: [] },
      { name: "Ahmednagar", slug: "ahmednagar", displayName: "Ahmednagar (Ahilyanagar)", aliases: ["Ahilyanagar"], pincodes: [] },
      { name: "Chandrapur", slug: "chandrapur", aliases: [], pincodes: [] },
      { name: "Parbhani", slug: "parbhani", aliases: [], pincodes: [] },
      { name: "Ichalkaranji", slug: "ichalkaranji", aliases: ["Manchester of Maharashtra"], pincodes: [] },
      { name: "Jalna", slug: "jalna", aliases: ["Steel City of Maharashtra"], pincodes: [] },
      { name: "Kalyan-Dombivli", slug: "kalyan-dombivli", aliases: ["Kalyan", "Dombivli"], pincodes: [] },
      { name: "Vasai-Virar", slug: "vasai-virar", aliases: ["Vasai", "Virar"], pincodes: [] },
      { name: "Mira-Bhayandar", slug: "mira-bhayandar", aliases: ["Mira Road", "Bhayandar"], pincodes: [] },
      { name: "Panvel", slug: "panvel", aliases: ["Raigad"], pincodes: [] },
      { name: "Satara", slug: "satara", aliases: [], pincodes: [] },
      { name: "Ratnagiri", slug: "ratnagiri", aliases: [], pincodes: [] }
    ]
  },
  {
    state: "Manipur",
    stateCode: "MN",
    cities: [
      { name: "Imphal", slug: "imphal", aliases: [], pincodes: [] },
      { name: "Churachandpur", slug: "churachandpur", aliases: [], pincodes: [] },
      { name: "Thoubal", slug: "thoubal", aliases: [], pincodes: [] },
      { name: "Kakching", slug: "kakching", aliases: [], pincodes: [] },
      { name: "Ukhrul", slug: "ukhrul", aliases: [], pincodes: [] },
      { name: "Bishnupur", slug: "bishnupur", aliases: [], pincodes: [] }
    ]
  },
  {
    state: "Meghalaya",
    stateCode: "ML",
    cities: [
      { name: "Shillong", slug: "shillong", aliases: ["Scotland of the East"], pincodes: [] },
      { name: "Tura", slug: "tura", aliases: ["Garo Hills"], pincodes: [] },
      { name: "Jowai", slug: "jowai", aliases: ["Jaintia Hills"], pincodes: [] },
      { name: "Nongpoh", slug: "nongpoh", aliases: ["Ri-Bhoi"], pincodes: [] },
      { name: "Cherrapunji", slug: "cherrapunji", displayName: "Cherrapunji (Sohra)", aliases: ["Sohra"], pincodes: [] }
    ]
  },
  {
    state: "Mizoram",
    stateCode: "MZ",
    cities: [
      { name: "Aizawl", slug: "aizawl", aliases: [], pincodes: [] },
      { name: "Lunglei", slug: "lunglei", aliases: [], pincodes: [] },
      { name: "Champhai", slug: "champhai", aliases: [], pincodes: [] },
      { name: "Serchhip", slug: "serchhip", aliases: [], pincodes: [] },
      { name: "Kolasib", slug: "kolasib", aliases: [], pincodes: [] }
    ]
  },
  {
    state: "Nagaland",
    stateCode: "NL",
    cities: [
      { name: "Kohima", slug: "kohima", aliases: [], pincodes: [] },
      { name: "Dimapur", slug: "dimapur", aliases: ["Commercial Capital of Nagaland"], pincodes: [] },
      { name: "Mokokchung", slug: "mokokchung", aliases: [], pincodes: [] },
      { name: "Tuensang", slug: "tuensang", aliases: [], pincodes: [] },
      { name: "Wokha", slug: "wokha", aliases: [], pincodes: [] },
      { name: "Zunheboto", slug: "zunheboto", aliases: [], pincodes: [] }
    ]
  },
  {
    state: "Odisha",
    stateCode: "OD",
    cities: [
      { name: "Bhubaneswar", slug: "bhubaneswar", displayName: "Bhubaneswar (Temple City)", aliases: ["Bhubaneshwar", "Temple City"], pincodes: [] },
      { name: "Cuttack", slug: "cuttack", aliases: ["Silver City"], pincodes: [] },
      { name: "Rourkela", slug: "rourkela", aliases: ["Steel City of Odisha"], pincodes: [] },
      { name: "Berhampur", slug: "berhampur", displayName: "Berhampur (Brahmapur)", aliases: ["Brahmapur", "Silk City"], pincodes: [] },
      { name: "Sambalpur", slug: "sambalpur", aliases: [], pincodes: [] },
      { name: "Puri", slug: "puri", aliases: ["Jagannath Puri"], pincodes: [] },
      { name: "Balasore", slug: "balasore", displayName: "Balasore (Baleswar)", aliases: ["Baleswar"], pincodes: [] },
      { name: "Bhadrak", slug: "bhadrak", aliases: [], pincodes: [] },
      { name: "Baripada", slug: "baripada", aliases: ["Mayurbhanj"], pincodes: [] },
      { name: "Jharsuguda", slug: "jharsuguda", aliases: [], pincodes: [] },
      { name: "Jeypore", slug: "jeypore", aliases: ["Koraput"], pincodes: [] },
      { name: "Bargarh", slug: "bargarh", aliases: [], pincodes: [] },
      { name: "Angul", slug: "angul", aliases: [], pincodes: [] },
      { name: "Balangir", slug: "balangir", aliases: ["Bolangir"], pincodes: [] }
    ]
  },
  {
    state: "Punjab",
    stateCode: "PB",
    cities: [
      { name: "Ludhiana", slug: "ludhiana", aliases: ["Manchester of India"], pincodes: [] },
      { name: "Amritsar", slug: "amritsar", aliases: ["Holy City", "Golden Temple"], pincodes: [] },
      { name: "Jalandhar", slug: "jalandhar", aliases: ["Sports City"], pincodes: [] },
      { name: "Patiala", slug: "patiala", aliases: ["Royal City"], pincodes: [] },
      { name: "Bathinda", slug: "bathinda", aliases: ["Bhatinda"], pincodes: [] },
      { name: "Mohali", slug: "mohali", displayName: "Mohali (SAS Nagar)", aliases: ["SAS Nagar", "Sahibzada Ajit Singh Nagar"], pincodes: [] },
      { name: "Pathankot", slug: "pathankot", aliases: [], pincodes: [] },
      { name: "Hoshiarpur", slug: "hoshiarpur", aliases: [], pincodes: [] },
      { name: "Batala", slug: "batala", aliases: [], pincodes: [] },
      { name: "Moga", slug: "moga", aliases: [], pincodes: [] },
      { name: "Abohar", slug: "abohar", aliases: [], pincodes: [] },
      { name: "Khanna", slug: "khanna", aliases: [], pincodes: [] },
      { name: "Phagwara", slug: "phagwara", aliases: [], pincodes: [] },
      { name: "Muktsar", slug: "muktsar", displayName: "Muktsar (Sri Muktsar Sahib)", aliases: ["Sri Muktsar Sahib"], pincodes: [] },
      { name: "Barnala", slug: "barnala", aliases: [], pincodes: [] },
      { name: "Firozpur", slug: "firozpur", aliases: ["Ferozepur"], pincodes: [] },
      { name: "Kapurthala", slug: "kapurthala", aliases: [], pincodes: [] },
      { name: "Sangrur", slug: "sangrur", aliases: [], pincodes: [] },
      { name: "Kharar", slug: "kharar", aliases: [], pincodes: [] }
    ]
  },
  {
    state: "Rajasthan",
    stateCode: "RJ",
    cities: [
      { name: "Jaipur", slug: "jaipur", aliases: ["Pink City"], pincodes: [] },
      { name: "Jodhpur", slug: "jodhpur", aliases: ["Blue City", "Sun City"], pincodes: [] },
      { name: "Kota", slug: "kota", aliases: ["Coaching City", "Education Hub"], pincodes: [] },
      { name: "Bikaner", slug: "bikaner", aliases: [], pincodes: [] },
      { name: "Ajmer", slug: "ajmer", aliases: [], pincodes: [] },
      { name: "Udaipur", slug: "udaipur-rj", displayName: "Udaipur (City of Lakes)", aliases: ["City of Lakes"], pincodes: [] },
      { name: "Bhilwara", slug: "bhilwara", aliases: ["Textile City"], pincodes: [] },
      { name: "Alwar", slug: "alwar", aliases: [], pincodes: [] },
      { name: "Bharatpur", slug: "bharatpur", aliases: [], pincodes: [] },
      { name: "Sikar", slug: "sikar", aliases: [], pincodes: [] },
      { name: "Sri Ganganagar", slug: "sri-ganganagar", aliases: ["Ganganagar"], pincodes: [] },
      { name: "Pali", slug: "pali", aliases: [], pincodes: [] },
      { name: "Beawar", slug: "beawar", aliases: [], pincodes: [] },
      { name: "Tonk", slug: "tonk", aliases: [], pincodes: [] },
      { name: "Hanumangarh", slug: "hanumangarh", aliases: [], pincodes: [] },
      { name: "Jhunjhunu", slug: "jhunjhunu", aliases: [], pincodes: [] },
      { name: "Chittorgarh", slug: "chittorgarh", aliases: ["Chittor"], pincodes: [] },
      { name: "Barmer", slug: "barmer", aliases: [], pincodes: [] },
      { name: "Nagaur", slug: "nagaur", aliases: [], pincodes: [] },
      { name: "Churu", slug: "churu", aliases: [], pincodes: [] },
      { name: "Sawai Madhopur", slug: "sawai-madhopur", aliases: ["Ranthambore"], pincodes: [] }
    ]
  },
  {
    state: "Sikkim",
    stateCode: "SK",
    cities: [
      { name: "Gangtok", slug: "gangtok", aliases: [], pincodes: [] },
      { name: "Namchi", slug: "namchi", aliases: [], pincodes: [] },
      { name: "Gyalshing", slug: "gyalshing", aliases: ["Geyzing"], pincodes: [] },
      { name: "Mangan", slug: "mangan", aliases: [], pincodes: [] },
      { name: "Singtam", slug: "singtam", aliases: [], pincodes: [] },
      { name: "Rangpo", slug: "rangpo", aliases: [], pincodes: [] }
    ]
  },
  {
    state: "Tamil Nadu",
    stateCode: "TN",
    cities: [
      { name: "Chennai", slug: "chennai", displayName: "Chennai (Madras)", aliases: ["Madras", "Gateway of South India"], pincodes: [] },
      { name: "Coimbatore", slug: "coimbatore", displayName: "Coimbatore (Kovai)", aliases: ["Kovai", "Manchester of South India"], pincodes: [] },
      { name: "Madurai", slug: "madurai", aliases: ["Temple City"], pincodes: [] },
      { name: "Tiruchirappalli", slug: "tiruchirappalli", displayName: "Tiruchirappalli (Trichy)", aliases: ["Trichy", "Tiruchi"], pincodes: [] },
      { name: "Salem", slug: "salem", aliases: ["Steel City"], pincodes: [] },
      { name: "Tiruppur", slug: "tiruppur", displayName: "Tiruppur (Tirupur)", aliases: ["Tirupur", "Knitwear Capital"], pincodes: [] },
      { name: "Erode", slug: "erode", aliases: ["Turmeric City"], pincodes: [] },
      { name: "Vellore", slug: "vellore", aliases: ["Fort City"], pincodes: [] },
      { name: "Tirunelveli", slug: "tirunelveli", aliases: ["Nellai"], pincodes: [] },
      { name: "Thoothukudi", slug: "thoothukudi", displayName: "Thoothukudi (Tuticorin)", aliases: ["Tuticorin", "Pearl City"], pincodes: [] },
      { name: "Dindigul", slug: "dindigul", aliases: ["City of Locks"], pincodes: [] },
      { name: "Thanjavur", slug: "thanjavur", displayName: "Thanjavur (Tanjore)", aliases: ["Tanjore"], pincodes: [] },
      { name: "Nagercoil", slug: "nagercoil", aliases: ["Kanyakumari"], pincodes: [] },
      { name: "Kanchipuram", slug: "kanchipuram", displayName: "Kanchipuram (Conjeevaram)", aliases: ["Conjeevaram", "Silk City"], pincodes: [] },
      { name: "Karur", slug: "karur", aliases: [], pincodes: [] },
      { name: "Hosur", slug: "hosur", aliases: ["Industrial Hub"], pincodes: [] },
      { name: "Cuddalore", slug: "cuddalore", aliases: [], pincodes: [] },
      { name: "Kumbakonam", slug: "kumbakonam", aliases: [], pincodes: [] },
      { name: "Neyveli", slug: "neyveli", aliases: [], pincodes: [] },
      { name: "Sivakasi", slug: "sivakasi", aliases: ["Cracker City"], pincodes: [] }
    ]
  },
  {
    state: "Telangana",
    stateCode: "TG",
    cities: [
      { name: "Hyderabad", slug: "hyderabad", aliases: ["Cyberabad", "City of Pearls", "Secunderabad"], pincodes: [] },
      { name: "Warangal", slug: "warangal", displayName: "Warangal (Orugallu)", aliases: ["Orugallu", "Kazipet", "Hanamkonda"], pincodes: [] },
      { name: "Nizamabad", slug: "nizamabad", aliases: [], pincodes: [] },
      { name: "Karimnagar", slug: "karimnagar", aliases: [], pincodes: [] },
      { name: "Ramagundam", slug: "ramagundam", aliases: [], pincodes: [] },
      { name: "Khammam", slug: "khammam", aliases: [], pincodes: [] },
      { name: "Mahbubnagar", slug: "mahbubnagar", displayName: "Mahbubnagar (Palamuru)", aliases: ["Palamuru"], pincodes: [] },
      { name: "Nalgonda", slug: "nalgonda", aliases: [], pincodes: [] },
      { name: "Adilabad", slug: "adilabad", aliases: [], pincodes: [] },
      { name: "Siddipet", slug: "siddipet", aliases: [], pincodes: [] },
      { name: "Suryapet", slug: "suryapet", aliases: [], pincodes: [] },
      { name: "Miryalaguda", slug: "miryalaguda", aliases: [], pincodes: [] },
      { name: "Mancherial", slug: "mancherial", aliases: [], pincodes: [] }
    ]
  },
  {
    state: "Tripura",
    stateCode: "TR",
    cities: [
      { name: "Agartala", slug: "agartala", aliases: [], pincodes: [] },
      { name: "Udaipur", slug: "udaipur-tr", displayName: "Udaipur (Tripura)", aliases: ["Matabari", "Radhakishorepur"], pincodes: [] },
      { name: "Dharmanagar", slug: "dharmanagar", aliases: [], pincodes: [] },
      { name: "Kailashahar", slug: "kailashahar", aliases: [], pincodes: [] },
      { name: "Belonia", slug: "belonia", aliases: [], pincodes: [] },
      { name: "Khowai", slug: "khowai", aliases: [], pincodes: [] }
    ]
  },
  {
    state: "Uttar Pradesh",
    stateCode: "UP",
    cities: [
      { name: "Lucknow", slug: "lucknow", aliases: ["City of Nawabs"], pincodes: [] },
      { name: "Kanpur", slug: "kanpur", displayName: "Kanpur (Cawnpore)", aliases: ["Cawnpore", "Manchester of the East"], pincodes: [] },
      { name: "Varanasi", slug: "varanasi", displayName: "Varanasi (Banaras/Kashi)", aliases: ["Banaras", "Benares", "Kashi"], pincodes: [] },
      { name: "Agra", slug: "agra", aliases: ["City of Taj"], pincodes: [] },
      { name: "Meerut", slug: "meerut", aliases: ["Sports City of UP"], pincodes: [] },
      { name: "Noida", slug: "noida", displayName: "Noida (Gautam Buddha Nagar)", aliases: ["Gautam Buddha Nagar", "GB Nagar"], pincodes: [] },
      { name: "Greater Noida", slug: "greater-noida", aliases: [], pincodes: [] },
      { name: "Ghaziabad", slug: "ghaziabad", aliases: ["Gateway of UP"], pincodes: [] },
      { name: "Prayagraj", slug: "prayagraj", displayName: "Prayagraj (Allahabad)", aliases: ["Allahabad", "Sangam Nagari"], pincodes: [] },
      { name: "Bareilly", slug: "bareilly", aliases: ["Bans Bareilly"], pincodes: [] },
      { name: "Aligarh", slug: "aligarh", aliases: ["Lock City"], pincodes: [] },
      { name: "Moradabad", slug: "moradabad", aliases: ["Brass City"], pincodes: [] },
      { name: "Mathura", slug: "mathura", aliases: ["Vrindavan", "Braj"], pincodes: [] },
      { name: "Saharanpur", slug: "saharanpur", aliases: ["Woodcraft City"], pincodes: [] },
      { name: "Gorakhpur", slug: "gorakhpur", aliases: [], pincodes: [] },
      { name: "Firozabad", slug: "firozabad", aliases: ["Glass City"], pincodes: [] },
      { name: "Jhansi", slug: "jhansi", aliases: [], pincodes: [] },
      { name: "Muzaffarnagar", slug: "muzaffarnagar", aliases: [], pincodes: [] },
      { name: "Ayodhya", slug: "ayodhya", displayName: "Ayodhya (Faizabad)", aliases: ["Faizabad", "Saket"], pincodes: [] },
      { name: "Shahjahanpur", slug: "shahjahanpur", aliases: [], pincodes: [] },
      { name: "Rampur", slug: "rampur", aliases: [], pincodes: [] },
      { name: "Farrukhabad", slug: "farrukhabad", aliases: ["Fatehgarh"], pincodes: [] },
      { name: "Budaun", slug: "budaun", aliases: [], pincodes: [] },
      { name: "Hapur", slug: "hapur", aliases: [], pincodes: [] },
      { name: "Etawah", slug: "etawah", aliases: [], pincodes: [] },
      { name: "Mirzapur", slug: "mirzapur", aliases: ["Vindhyachal"], pincodes: [] },
      { name: "Bulandshahr", slug: "bulandshahr", aliases: [], pincodes: [] },
      { name: "Sambhal", slug: "sambhal", aliases: [], pincodes: [] },
      { name: "Amroha", slug: "amroha", aliases: [], pincodes: [] },
      { name: "Fatehpur", slug: "fatehpur", aliases: [], pincodes: [] },
      { name: "Raebareli", slug: "raebareli", aliases: [], pincodes: [] },
      { name: "Orai", slug: "orai", aliases: ["Jalaun"], pincodes: [] },
      { name: "Bahraich", slug: "bahraich", aliases: [], pincodes: [] },
      { name: "Jaunpur", slug: "jaunpur", aliases: [], pincodes: [] },
      { name: "Unnao", slug: "unnao", aliases: [], pincodes: [] }
    ]
  },
  {
    state: "Uttarakhand",
    stateCode: "UK",
    cities: [
      { name: "Dehradun", slug: "dehradun", aliases: ["Doon"], pincodes: [] },
      { name: "Haridwar", slug: "haridwar", aliases: ["Hardwar", "Mayapuri"], pincodes: [] },
      { name: "Roorkee", slug: "roorkee", aliases: ["IIT Roorkee"], pincodes: [] },
      { name: "Haldwani", slug: "haldwani", aliases: ["Haldwani-cum-Kathgodam", "Kathgodam"], pincodes: [] },
      { name: "Rishikesh", slug: "rishikesh", aliases: ["Yoga Capital"], pincodes: [] },
      { name: "Nainital", slug: "nainital", aliases: ["Lake City"], pincodes: [] },
      { name: "Rudrapur", slug: "rudrapur", aliases: ["Udham Singh Nagar"], pincodes: [] },
      { name: "Kashipur", slug: "kashipur", aliases: [], pincodes: [] },
      { name: "Kotdwar", slug: "kotdwar", aliases: ["Kotdwara"], pincodes: [] },
      { name: "Mussoorie", slug: "mussoorie", aliases: ["Queen of Hills"], pincodes: [] },
      { name: "Pithoragarh", slug: "pithoragarh", aliases: [], pincodes: [] },
      { name: "Almora", slug: "almora", aliases: [], pincodes: [] },
      { name: "Ranikhet", slug: "ranikhet", aliases: [], pincodes: [] },
      { name: "Ramnagar", slug: "ramnagar", aliases: ["Jim Corbett"], pincodes: [] },
      { name: "Srinagar", slug: "srinagar-uk", displayName: "Srinagar (Garhwal)", aliases: ["Garhwal Srinagar"], pincodes: [] },
      { name: "Tehri", slug: "tehri", aliases: ["New Tehri"], pincodes: [] },
      { name: "Vikasnagar", slug: "vikasnagar", aliases: [], pincodes: [] }
    ]
  },
  {
    state: "West Bengal",
    stateCode: "WB",
    cities: [
      { name: "Kolkata", slug: "kolkata", displayName: "Kolkata (Calcutta)", aliases: ["Calcutta", "City of Joy"], pincodes: [] },
      { name: "Howrah", slug: "howrah", aliases: ["Haora"], pincodes: [] },
      { name: "Durgapur", slug: "durgapur", aliases: ["Steel City of Eastern India"], pincodes: [] },
      { name: "Asansol", slug: "asansol", aliases: ["City of Brotherhood"], pincodes: [] },
      { name: "Siliguri", slug: "siliguri", aliases: ["Gateway to North East"], pincodes: [] },
      { name: "Kharagpur", slug: "kharagpur", aliases: ["IIT Kharagpur"], pincodes: [] },
      { name: "Bardhaman", slug: "bardhaman", displayName: "Bardhaman (Burdwan)", aliases: ["Burdwan"], pincodes: [] },
      { name: "Malda", slug: "malda", displayName: "Malda (English Bazar)", aliases: ["English Bazar", "Mango City"], pincodes: [] },
      { name: "Baharampur", slug: "baharampur", displayName: "Baharampur (Berhampore)", aliases: ["Berhampore", "Murshidabad"], pincodes: [] },
      { name: "Habra", slug: "habra", aliases: [], pincodes: [] },
      { name: "Jalpaiguri", slug: "jalpaiguri", aliases: [], pincodes: [] },
      { name: "Kalyani", slug: "kalyani", aliases: [], pincodes: [] },
      { name: "Darjeeling", slug: "darjeeling", aliases: ["Queen of the Himalayas"], pincodes: [] },
      { name: "Haldia", slug: "haldia", aliases: ["Port City"], pincodes: [] },
      { name: "Midnapore", slug: "midnapore", displayName: "Midnapore (Medinipur)", aliases: ["Medinipur", "Paschim Medinipur"], pincodes: [] },
      { name: "Raiganj", slug: "raiganj", aliases: ["Uttar Dinajpur"], pincodes: [] },
      { name: "Krishnanagar", slug: "krishnanagar", aliases: ["Nadia"], pincodes: [] },
      { name: "Ranaghat", slug: "ranaghat", aliases: [], pincodes: [] },
      { name: "Santipur", slug: "santipur", aliases: [], pincodes: [] },
      { name: "Purulia", slug: "purulia", aliases: [], pincodes: [] },
      { name: "Cooch Behar", slug: "cooch-behar", aliases: ["Koch Bihar"], pincodes: [] },
      { name: "Bankura", slug: "bankura", aliases: [], pincodes: [] }
    ]
  }
];

/**
 * Slugs for quick-access popular locations (including All India)
 */
export const popularLocationSlugs = [
  "all-india",
  "delhi",
  "mumbai",
  "bengaluru",
  "hyderabad",
  "kolkata",
  "chennai",
  "pune",
  "ahmedabad",
  "chandigarh",
  "jaipur",
  "lucknow",
  "bhopal",
  "indore",
  "patna",
  "ranchi",
  "haridwar",
  "dehradun",
  "asansol",
  "guwahati",
  "bhubaneswar"
];

// Pre-computed internal caches for fast lookups
let _allCitiesCache = null;
let _slugMapCache = null;
let _stateMapCache = null;

/**
 * Get all States and Union Territories metadata
 * @returns {Array<{ state: string, stateCode: string, cityCount: number }>}
 */
export function getAllStates() {
  return locations.map(s => ({
    state: s.state,
    stateCode: s.stateCode,
    cityCount: s.cities.length
  }));
}

/**
 * Formats a city's canonical display name with aliases if useful
 * Example: Medininagar (Daltonganj)
 * @param {Object} city 
 * @returns {string}
 */
export function getCityDisplayName(city) {
  if (!city) return "";
  if (city.displayName) return city.displayName;
  return city.name;
}

/**
 * Get full formatted location string
 * Examples: "Haridwar, Uttarakhand", "All India"
 * @param {Object} loc 
 * @returns {string}
 */
export function getFormattedLocation(loc) {
  if (!loc || loc.isAllIndia || loc.slug === 'all-india') {
    return "All India";
  }
  const cityName = getCityDisplayName(loc);
  if (loc.state) {
    return `${cityName}, ${loc.state}`;
  }
  return cityName;
}

/**
 * Returns a flat array of all cities across all States and Union Territories
 * Cached in memory after first call.
 * @returns {Array<Object>}
 */
export function getAllCities() {
  if (_allCitiesCache) return _allCitiesCache;

  const flat = [];
  for (const s of locations) {
    for (const c of s.cities) {
      flat.push({
        ...c,
        displayName: getCityDisplayName(c),
        state: s.state,
        stateCode: s.stateCode
      });
    }
  }
  _allCitiesCache = Object.freeze(flat);
  return _allCitiesCache;
}

/**
 * Internal index mapping slugs to city objects
 */
function getSlugMap() {
  if (_slugMapCache) return _slugMapCache;

  const map = new Map();
  map.set(ALL_INDIA_LOCATION.slug, ALL_INDIA_LOCATION);

  for (const city of getAllCities()) {
    map.set(city.slug, city);
    // Index aliases as alias-slugs so historical names (e.g. daltonganj -> medininagar) resolve cleanly
    if (Array.isArray(city.aliases)) {
      for (const alias of city.aliases) {
        const aliasKey = String(alias).trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        if (aliasKey && !map.has(aliasKey)) {
          map.set(aliasKey, city);
        }
      }
    }
  }
  _slugMapCache = map;
  return _slugMapCache;
}

/**
 * Internal index mapping state name/code to state objects
 */
function getStateMap() {
  if (_stateMapCache) return _stateMapCache;

  const map = new Map();
  for (const s of locations) {
    map.set(s.state.toLowerCase(), s);
    if (s.stateCode) {
      map.set(s.stateCode.toLowerCase(), s);
    }
  }
  _stateMapCache = map;
  return _stateMapCache;
}

/**
 * Look up location by its unique slug or alias
 * @param {string} slug 
 * @returns {Object|null}
 */
export function getLocationBySlug(slug) {
  if (!slug) return ALL_INDIA_LOCATION;
  const cleanSlug = String(slug).trim().toLowerCase();
  if (cleanSlug === 'all-india' || cleanSlug === 'all' || cleanSlug === 'india') {
    return ALL_INDIA_LOCATION;
  }
  const map = getSlugMap();
  const direct = map.get(cleanSlug);
  if (direct) return direct;
  return getLocationByAlias(cleanSlug) || null;
}

/**
 * Get all cities belonging to a particular State or Union Territory
 * @param {string} stateIdentifier (state name or stateCode)
 * @returns {Array<Object>}
 */
export function getCitiesByState(stateIdentifier) {
  if (!stateIdentifier) return [];
  const map = getStateMap();
  const matched = map.get(String(stateIdentifier).trim().toLowerCase());
  if (!matched) return [];
  return matched.cities.map(c => ({
    ...c,
    displayName: getCityDisplayName(c),
    state: matched.state,
    stateCode: matched.stateCode
  }));
}

/**
 * Look up location by an alias
 * @param {string} alias 
 * @returns {Object|null}
 */
export function getLocationByAlias(alias) {
  if (!alias) return null;
  const clean = String(alias).trim().toLowerCase();
  for (const c of getAllCities()) {
    if (c.aliases && c.aliases.some(a => a.toLowerCase() === clean)) {
      return c;
    }
  }
  return null;
}

/**
 * Resolve popular locations list into rich location objects
 * @returns {Array<Object>}
 */
export function getPopularLocations() {
  return popularLocationSlugs
    .map(slug => getLocationBySlug(slug))
    .filter(Boolean);
}

/**
 * Smart Search locations across:
 * - City name (prefix, contains)
 * - Aliases (e.g. "Daltonganj" -> Medininagar, "Bangalore" -> Bengaluru)
 * - State name / UT name (e.g. "Uttarakhand", "Madhya Pradesh")
 * - State code (e.g. "UK", "MP", "MH")
 *
 * @param {string} query 
 * @param {number} limit 
 * @returns {Array<Object>}
 */
export function searchLocations(query, limit = 25) {
  if (!query || typeof query !== 'string') return [];
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) return [];

  // Match "All India" if query matches
  const results = [];
  if ("all india".includes(cleanQuery) || "india".startsWith(cleanQuery)) {
    results.push({ ...ALL_INDIA_LOCATION, score: 100 });
  }

  const allCities = getAllCities();
  const scored = [];

  for (const city of allCities) {
    const cityNameLower = city.name.toLowerCase();
    const stateNameLower = city.state.toLowerCase();
    const stateCodeLower = (city.stateCode || '').toLowerCase();

    let bestScore = 0;
    let matchedAlias = null;

    // 1. Exact city name match
    if (cityNameLower === cleanQuery) {
      bestScore = Math.max(bestScore, 100);
    }
    // 2. City name starts with query
    else if (cityNameLower.startsWith(cleanQuery)) {
      bestScore = Math.max(bestScore, 85);
    }

    // 3. Alias check
    if (Array.isArray(city.aliases)) {
      for (const a of city.aliases) {
        const aLower = a.toLowerCase();
        if (aLower === cleanQuery) {
          if (bestScore < 95) {
            bestScore = 95;
            matchedAlias = a;
          }
        } else if (aLower.startsWith(cleanQuery)) {
          if (bestScore < 80) {
            bestScore = 80;
            matchedAlias = a;
          }
        } else if (aLower.includes(cleanQuery)) {
          if (bestScore < 55) {
            bestScore = 55;
            matchedAlias = a;
          }
        }
      }
    }

    // 4. City name contains query (word boundary or substring)
    if (cityNameLower.includes(cleanQuery)) {
      const isWordBoundary = cityNameLower.includes(" " + cleanQuery) || cityNameLower.includes("-" + cleanQuery);
      const score = isWordBoundary ? 75 : 65;
      if (bestScore < score) {
        bestScore = score;
      }
    }

    // 5. State name or state code match
    if (stateNameLower === cleanQuery || stateCodeLower === cleanQuery) {
      if (bestScore < 50) {
        bestScore = 50;
      }
    } else if (stateNameLower.startsWith(cleanQuery)) {
      if (bestScore < 45) {
        bestScore = 45;
      }
    } else if (stateNameLower.includes(cleanQuery)) {
      if (bestScore < 35) {
        bestScore = 35;
      }
    }

    if (bestScore > 0) {
      scored.push({
        ...city,
        matchedAlias,
        score: bestScore
      });
    }
  }

  // Sort by score descending; if score equal, sort alphabetically by city name
  scored.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));

  const merged = [...results, ...scored];

  // De-duplicate by slug and limit
  const seen = new Set();
  const unique = [];
  for (const item of merged) {
    if (!seen.has(item.slug)) {
      seen.add(item.slug);
      unique.push(item);
      if (unique.length >= limit) break;
    }
  }

  return unique;
}

/**
 * Flexible Availability Filter for D.CARD Products:
 * Products may have:
 * - availability: { type: "all_india" }
 * - availability: { type: "states", states: ["Punjab", "Haryana"] }
 * - availability: { type: "cities", cities: ["Haridwar", "Dehradun"] }
 * - availability: { type: "branch_dependent" }
 *
 * If a product lacks an availability definition, it defaults to nationwide (All India).
 *
 * @param {Object} product
 * @param {Object|string} selectedLocation (Location object or slug)
 * @returns {boolean}
 */
export function isProductAvailableInLocation(product, selectedLocation) {
  if (!selectedLocation) return true;

  const loc = typeof selectedLocation === 'string'
    ? getLocationBySlug(selectedLocation)
    : selectedLocation;

  // If user selected "All India" or invalid location, show all products
  if (!loc || loc.isAllIndia || loc.slug === 'all-india') {
    return true;
  }

  // If product does not specify availability, default is nationwide
  if (!product || !product.availability) {
    return true;
  }

  const { type, states, cities } = product.availability;

  if (!type || type === 'all_india' || type === 'allIndia') {
    return true;
  }

  if (type === 'states' && Array.isArray(states)) {
    const locStateLower = (loc.state || '').toLowerCase();
    const locStateCodeLower = (loc.stateCode || '').toLowerCase();
    return states.some(s => {
      const sLower = String(s).toLowerCase();
      return sLower === locStateLower || sLower === locStateCodeLower;
    });
  }

  if (type === 'cities' && Array.isArray(cities)) {
    const locNameLower = (loc.name || '').toLowerCase();
    const locSlugLower = (loc.slug || '').toLowerCase();
    const aliasesLower = (loc.aliases || []).map(a => a.toLowerCase());

    return cities.some(c => {
      const cLower = String(c).toLowerCase();
      return (
        cLower === locNameLower ||
        cLower === locSlugLower ||
        aliasesLower.includes(cLower)
      );
    });
  }

  if (type === 'branch_dependent') {
    // For branch dependent products without verified city-level restrictions, allow discovery
    return true;
  }

  return true;
}

/**
 * Backwards compatibility map:
 * INDIAN_LOCATIONS = { "Maharashtra": ["Mumbai", "Pune", ...], ... }
 * Sourced directly from centralized locations.
 */
export const INDIAN_LOCATIONS = Object.freeze(
  locations.reduce((acc, curr) => {
    acc[curr.state] = curr.cities.map(c => c.name);
    return acc;
  }, {})
);

/**
 * Supported International Country Dial Codes (for forms & phone input)
 */
export const COUNTRY_CODES = Object.freeze([
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+1", country: "United States", flag: "🇺🇸" },
  { code: "+44", country: "United Kingdom", flag: "🇬🇧" },
  { code: "+971", country: "UAE", flag: "🇦🇪" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+81", country: "Japan", flag: "🇯🇵" }
]);
