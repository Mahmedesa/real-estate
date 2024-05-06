import Apartment from '../models/apartmentModel.js'

const getApartments = async(req, res)=> {
    const pageSize = 8;
    const page = Number(req.query.pageNumber) || 1 ;
    const Keyword = req.query.Keyword ?
    {name: {$regex: req.query.Keyword, $options: 'i'}}:
    {};
    const count = await Apartment.countDocuments({...Keyword});
    const apartments = await Apartment.find({...Keyword})
    .limit(pageSize)
    .skip(pageSize*(page-1));
    res.json({apartments, page, pages: Math.ceil(count/ pageSize)});
}

const getApartmentById = async(req, res)=>{
    const apartment = await Apartment.findById(req.params.id);
    if(apartment){
        return res.json(apartment);
    }else{
        res.status(404);
        throw new Error('Resource not found');
    }
}

const createApartment = async(req, res)=>{
    const apartment = new Apartment({
        category:'sample apartment',
        price: '0',
        image: '',
        user: req.user._id,
        address: 'sample address',
        description: 'sample description',
        numReviews: 0,
        sold: false
    });
    const createdApartment = await apartment.save();
    res.status(201).json(createdApartment)
}

const updateApartment = async(req, res) => {
    const {
        category,
        price,
        description,
        image,
        address,
        sold
    }= req.body;

    const apartment = await Apartment.findById(req.params.id);
    if(apartment){
        apartment.category= category;
        apartment.price = price;
        apartment.description = description;
        apartment.image = image;
        apartment.address = address;
        apartment.sold = sold;

        const updatedApartment = await apartment.save();
        res.json(updatedApartment);
    }else{
        res.status(404);
        throw new Error('Resource not found');
    }
}

const deleteApartment = async (req, res) => {
    const apartment = await Apartment.findById(req.params._id);
    if(apartment){
        await Apartment.deleteOne({_id: apartment._id});
        res.status(200).json({message: 'Apartment deleted'});
    }else{
        res.status(404);
        throw new Error('Resource not found');
    }
}

const createApartmentReviews = async(req, res)=>{
    const {rating, comment} = req.body;
    const apartment = await Apartment.findById(req.params.id);
    if(apartment){
        const alreadyReviewed = apartment.reviews.find(
            (review) => review.user.toString() === req.user._id.toString()
        );
        if(alreadyReviewed){
            res.status(400);
            throw new Error('Apartment already reviewed')
        }
        const review= {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id
        }
        apartment.reviews.push(review);
        apartment.numReviews = apartment.reviews.length;
        
        apartment.rating = apartment.reviews.reduce((acc, item)=> acc+item.rating, 0)/
        apartment.reviews.length;

        await apartment.save();
        res.status(201).json({message: 'Review added'})
    }else{
        res.status(404);
        throw new Error('Resource not found');
    }
}

const getTopApartments = async (req, res) => {
    const apartments = await Apartment.find({}).sort({rating: -1}).limit(3);
    res.status(200).json(apartments);
}

export {
    getApartments,
    getApartmentById,
    createApartment,
    updateApartment,
    deleteApartment,
    createApartmentReviews,
    getTopApartments
}