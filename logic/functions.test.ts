import Guardia from '../@types/Guardia';
import { isGuardiaInCurrentWeek } from './functions';


const randomDate = (start:Date, end:Date) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

let startDate = new Date(2000, 0, 1); // Start date: January 1, 2000
let endDate = new Date();             // Current date as end date



describe('isGuardiaInCurrentWeek', () => {

    it('should return true if guardia is within the current week', () => {

        let randomGeneratedDate = randomDate(startDate, endDate);
        let endWeek = new Date();
        endWeek.setDate(endWeek.getDate() + 7);

        const currentWeek = [randomGeneratedDate, endWeek];

        const guardia: Guardia = {
            // Add dummy data for other fields
            createdAt: new Date(),
            updatedAt: null,
            teacher: null, // Replace with actual Teacher object if necessary
            teacherDocId: null,
            teacherEmail: null,
            collegeId: 'dummy_college_id',
            tasks: 'dummy_tasks',
            moreInfo: null,
            classroom: 'dummy_classroom',
            hour: 8,
            dayOfGuardia: randomDate(randomGeneratedDate, endWeek),
            isEmpty: false,
            color: 0,
        };

        expect(isGuardiaInCurrentWeek(guardia, currentWeek)).toBeTruthy();
    });

    // Additional test cases here...
});
